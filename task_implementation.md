# Task Implementation Reference

## 1. Backend: Wire default view columns into project creation

In `workspace.service.ts` — add one line after project is created:

```ts
async createProject(data: ProjectDb) {
  const { customFields, ...projectData } = data as any;
  const project = await this.workspaceRepo.addProject(projectData);

  if (!project) throw new AppError("Unable to create the project!");

  // 👇 This is the only new line needed
  await this.workspaceRepo.initializeDefaultViewColumns(project.id);

  if (customFields?.length) {
    for (const field of customFields) {
      await this.workspaceRepo.addCustomField({
        ...field,
        project_id: project.id,
      });
    }
  }

  return project;
}
```

The repository method already exists (`initializeDefaultViewColumns`), just needs to be called.

---

## 2. Backend: API route + controller + repo method to fetch view columns with property details

**Controller** (`workspace.controller.ts` — partial):

```ts
async getViewColumns(req: Request, res: Response, next: NextFunction) {
  try {
    const { project_id, view_type } = req.query as {
      project_id: string;
      view_type: ViewTypeEnumType;
    };

    const columns = await this.workspaceService.getViewColumns(
      project_id,
      view_type || "table"
    );

    res.status(200).json({ success: true, data: columns });
  } catch (error) {
    next(error);
  }
}
```

**Service** (`workspace.service.ts` — partial):

```ts
async getViewColumns(project_id: string, view_type: ViewTypeEnumType = "table") {
  const viewColumns = await this.workspaceRepo.findViewColumns(project_id, view_type);

  // Separate builtins from property columns
  const builtinColumns = viewColumns.filter((c) => c.column_type === "builtin");
  const propertyColumnIds = viewColumns
    .filter((c) => c.column_type === "property" && c.column_key)
    .map((c) => c.column_key as string);

  // Fetch property definitions for property-type columns
  const propertyDefs = propertyColumnIds.length
    ? await this.workspaceRepo.findPropertyDefinitionsByIds(propertyColumnIds)
    : [];

  return {
    builtin: builtinColumns,
    properties: propertyDefs,
  };
}
```

**Repository** (`workspace.repository.ts` — partial):

```ts
async findPropertyDefinitionsByIds(ids: string[]) {
  return await db.query.propertyDefinitionTable.findMany({=-0
    where: inArray(propertyDefinitionTable.id, ids),
    orderBy: asc(propertyDefinitionTable.position),
  });
}
```

**Route** (`workspace.routes.ts` — partial):

```ts
router.get(
  "/workspace/view-columns",
  authenticate,
  workspaceController.getViewColumns.bind(workspaceController)
);
```

---

## 3. Frontend: API function

Add to `frontend/src/features/project/api/project.api.ts`:

```ts
export const getViewColumns = async ({
  project_id,
  view_type,
}: {
  project_id: string;
  view_type: ViewTypeEnumType;
}) => {
  const res = await api.get("/workspace/view-columns", {
    params: { project_id, view_type },
    withCredentials: true,
  });
  return res.data.data;
};
```

---

## 4. Frontend: React hook

New file `frontend/src/features/project/hooks/use-view-columns.ts`:

```ts
import { useQuery } from "@tanstack/react-query";
import { getViewColumns } from "../api/project.api";
import type { ViewTypeEnumType } from "../types";

type BuiltInColumn = {
  id: string;
  column_key: string;
  position: number;
};

type PropertyColumn = {
  id: string;
  name: string;
  type: string;
  is_required: boolean;
  config: Record<string, unknown> | null;
};

type ViewColumnsResponse = {
  builtin: BuiltInColumn[];
  properties: PropertyColumn[];
};

const REQUIRED_COLUMNS: BuiltInColumn[] = [
  { id: "builtin-title", column_key: "title", position: -1 },
  { id: "builtin-status", column_key: "status", position: -1 },
];

export const useViewColumns = (
  project_id: string,
  view_type: ViewTypeEnumType = "table"
) => {
  return useQuery<ViewColumnsResponse>({
    queryKey: ["viewColumns", project_id, view_type],
    queryFn: () => getViewColumns({ project_id, view_type }),
    enabled: !!project_id,
    select: (data) => {
      // Ensure required columns always exist
      const existingKeys = new Set(data.builtin.map((c) => c.column_key));
      const missing = REQUIRED_COLUMNS.filter((c) => !existingKeys.has(c.column_key));

      return {
        ...data,
        builtin: [...missing, ...data.builtin],
      };
    },
  });
};
```

---

## 5. Frontend: Table component (the meat of it)

Replace the `ActiveTab` stub in `frontend/src/features/project/components/active-tab.tsx`:

```tsx
import { useViewColumns } from "../hooks/use-view-columns";
import { useTaskLabelByViewType } from "../hooks/use-task-labels";

const BUILTIN_HEADERS: Record<string, string> = {
  title: "Title",
  description: "Description",
  status: "Status",
  priority: "Priority",
  assignee: "Assignee",
  due_date: "Due Date",
  created_at: "Created At",
  updated_at: "Updated At",
};

// Type-specific cell renderers
const PropertyCell = ({
  type,
  value,
}: {
  type: string;
  value: unknown;
}) => {
  switch (type) {
    case "checkbox":
      return <input type="checkbox" checked={!!value} readOnly />;
    case "date":
      return <span>{value ? new Date(value as string).toLocaleDateString() : "—"}</span>;
    case "url":
      return value ? (
        <a href={(value as { url: string }).url} className="text-blue-500 underline">
          {(value as { label: string }).label || (value as { url: string }).url}
        </a>
      ) : (
        "—"
      );
    default:
      return <span>{value as string}</span>;
  }
};

export const ActiveTab = ({ activeTabId }: { activeTabId: string }) => {
  const { data: viewColumns, isLoading: columnsLoading } =
    useViewColumns(activeTabId, "table");
  // const { data: tasks } = useTasks(activeTabId); // you'll create this hook

  if (columnsLoading) return <div>Loading columns...</div>;

  // Merge built-in and property columns into one ordered list
  const allColumns = [
    ...(viewColumns?.builtin
      ?.sort((a, b) => a.position - b.position)
      .map((c) => ({ ...c, type: "builtin" as const })) ?? []),
    ...(viewColumns?.properties?.map((p) => ({
      id: p.id,
      column_key: p.name,
      type: "property" as const,
      propertyType: p.type,
      is_required: p.is_required,
    })) ?? []),
  ];

  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            {allColumns.map((col) => (
              <th
                key={`${col.type}-${col.column_key}`}
                className="px-4 py-2 text-left text-sm font-medium text-muted-foreground"
              >
                {col.type === "builtin"
                  ? BUILTIN_HEADERS[col.column_key] ?? col.column_key
                  : col.column_key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Empty state */}
          <tr>
            <td
              colSpan={allColumns.length}
              className="px-4 py-16 text-center text-muted-foreground"
            >
              No tasks yet. Create your first task.
            </td>
          </tr>

          {/* When tasks exist, map over them:
          {tasks?.map((task) => (
            <tr key={task.id} className="border-b hover:bg-muted/50">
              {allColumns.map((col) => (
                <td key={`${col.type}-${col.column_key}`} className="px-4 py-2">
                  {col.type === "builtin" ? (
                    renderBuiltinCell(col.column_key, task)
                  ) : (
                    <PropertyCell
                      type={col.propertyType}
                      value={task.properties?.[col.column_key]}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))} */}
        </tbody>
      </table>
    </div>
  );
};
```
