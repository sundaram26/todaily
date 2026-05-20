"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, LoaderCircle, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useProjectStore } from "../store/project.store";
import { CreateProject, CreateProjectType } from "../types";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProject } from "../hooks/use-create-project";
import { useUpdateProject } from "../hooks/use-update-project";
import { useProjectById } from "../hooks/use-project";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

interface CustomField {
  id: string;
  type: "status" | "priority" | "label";
  title: string;
  color: string;
}

export const AddProjectModal = () => {
  const { isModalOpen, closeModal, isEditMode, editingProjectId } = useProjectStore();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const { data: projectData } = useProjectById(editingProjectId || "");

  const {
    register,
    reset,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectType>({
    resolver: zodResolver(CreateProject),
    defaultValues: {
      title: "",
      description: "",
      label_id: undefined,
      due_date: undefined,
      customFields: [],
    },
  });

  useEffect(() => {
    if (isEditMode && projectData?.data) {
      const project = projectData.data;
      reset({
        title: project.title || "",
        description: project.description || "",
        label_id: project.label_id || undefined,
        due_date: project.due_date ? new Date(project.due_date) : undefined,
        customFields: project.customFields || [],
      });
      setDate(project.due_date ? new Date(project.due_date) : undefined);
    } else if (!isEditMode) {
      reset({
        title: "",
        description: "",
        label_id: undefined,
        due_date: undefined,
        customFields: [],
      });
      setDate(undefined);
    }
  }, [isEditMode, projectData, reset]);

  const { fields, append, remove, update } = useFieldArray({
    control: control,
    name: "customFields"
  })

  const labelFields = watch("customFields")?.filter((f) => f.type === "label") || [];
  const selectedLabelId = watch("label_id");

  const onSubmit = (data: CreateProjectType) => {
    const cleanedData = {
      ...data,
      label_id: data.label_id || undefined,
      customFields: data.customFields?.filter(f => f.title.trim() !== "") || [],
    };

    if (isEditMode && editingProjectId) {
      updateProject.mutate({ ...cleanedData, id: editingProjectId }, {
        onSuccess: () => {
          reset();
          closeModal();
        }
      });
    } else {
      createProject.mutate(cleanedData, {
        onSuccess: () => {
          reset();
          closeModal();
        },
      });
    }
  }

  const handleCancel = () => {
    reset();
    closeModal();
  }

  const addLabel = () => {
    append({
      type: "label",
      title: "",
      color:
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0"),
    });
  }

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 z-55 bg-primary-subtle/60"
        onClick={handleCancel}
      />

      <div className="max-h-[95vh] w-full max-w-2xl z-60 bg-primary-foreground border-2 border-ring tracking-tight">
        <div className="h-[10vh] border-b-2 border-primary flex items-center p-4">
          <h1 className="font-bold text-2xl">{isEditMode ? "Edit Project" : "Add Project"}</h1>
        </div>
        <div className="h-full w-full p-4 pb-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field className="w-full py-2">
                  <FieldLabel className="font-semibold text-foreground text-sm gap-0 leading-1.5">
                    Title
                  </FieldLabel>
                  <Input
                    type="text"
                    {...register("title")}
                    placeholder="Crazy Project"
                    className="rounded-sm h-10 md:h-12 border-2 border-border bg-input text-sm font-medium"
                    required
                  />
                  {errors.title && (
                    <FieldError className="text-error font-bold">
                      {errors.title?.message || "Invalid title input!"}
                    </FieldError>
                  )}
                </Field>
                <div className="w-full">
                  <FieldLabel className="font-semibold text-foreground text-sm gap-0 rounded-sm">
                    Due Date
                  </FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        data-empty={!date}
                        className="h-10 md:h-12 w-full bg-input text-sm font-medium justify-start text-left data-[empty=true]:text-muted-foreground rounded-sm border-2 border-border"
                      >
                        <CalendarIcon />
                        {date ? (
                          format(date, "PPP")
                        ) : (
                          <span className="text-foreground-muted">
                            DD/MM/YYYY
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-primary-foreground">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                          setDate(newDate);
                          setValue("due_date", newDate);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Field className="w-full py-2">
                <FieldLabel className="font-semibold text-foreground text-sm gap-0 leading-1.5">
                  Description
                </FieldLabel>
                <Textarea
                  {...register("description")}
                  placeholder="This is Crazy Project..."
                  className="rounded-sm h-20 md:h-24 border-2 border-border bg-input text-sm font-medium resize-none"
                  rows={3}
                />
              </Field>

              {isEditMode && labelFields.length > 0 && (
                <div className="py-2">
                  <FieldLabel className="font-semibold text-foreground text-sm mb-2 block">
                    Assign Label to Project
                  </FieldLabel>
                  <Select
                    value={selectedLabelId ?? ""}
                    onValueChange={(value) => setValue("label_id", value)}
                  >
                    <SelectTrigger className="h-10 md:h-12 w-full border-2 border-border rounded-sm bg-input">
                      <SelectValue placeholder="Select a label to display" />
                    </SelectTrigger>
                    <SelectContent className="bg-primary-foreground">
                      <SelectGroup>
                        {labelFields.map((field) => {
                          const fieldValue =
                            field.id ||
                            `temp-${field.type}-${field.title}-${field.color}`;
                          return (
                            <SelectItem key={fieldValue} value={fieldValue}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: field.color }}
                                />
                                {field.title || "Unnamed Label"}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <FieldSeparator />

              <Field className="max-h-36 w-full py-2 overflow-scroll no-scrollbar scroll-smooth">
                <div className="flex items-center justify-between mb-2">
                  <FieldLabel className="font-semibold text-foreground text-sm gap-0 leading-1.5 m-0">
                    Project Labels
                  </FieldLabel>
                  <Button
                    type="button"
                    onClick={addLabel}
                    className="h-8 px-3 bg-transparent border-2 border-primary rounded-sm text-primary text-sm font-semibold focus-visible:ring-2 focus-visible:ring-ring hover:bg-primary/50 disabled:bg-primary/50 transition-transform"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {labelFields.length === 0 ? (
                    <div className="text-center py-6 border-2 border-dashed border-border rounded-sm text-muted-foreground text-sm">
                      No Labels yet. Click "Add" to create one.
                    </div>
                  ) : (
                    labelFields.map((field, index) => {
                      const actualIndex = watch("customFields")?.findIndex(
                        (f) => f.id === field.id
                      )!;
                      return (
                        <div
                          key={field.id || `temp-label-${index}`}
                          className="flex items-center gap-3 p-3 border-2 border-border rounded-sm bg-input"
                        >
                          <Input
                            type="text"
                            {...register(`customFields.${actualIndex}.title`)}
                            placeholder="Label name..."
                            className="flex-1 h-9 min-w-0 rounded-sm border-2 border-border bg-input text-sm font-medium"
                          />
                          <div className="flex items-center gap-2">
                            <div className="relative w-9 h-9 shrink-0">
                              <Input
                                type="color"
                                {...register(
                                  `customFields.${actualIndex}.color`,
                                )}
                                className="absolute inset-0 w-full h-full rounded-sm cursor-pointer border-2 border-border p-0.5"
                              />
                            </div>
                            <Input
                              type="text"
                              {...register(`customFields.${actualIndex}.color`)}
                              className="w-20 h-9 rounded-sm border-2 border-border bg-input text-sm font-mono"
                              maxLength={7}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(actualIndex)}
                              className="text-3xl text-foreground-muted hover:bg-destructive/10 hover:text-destructive"
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-4 py-4">
                <Button
                  type="button"
                  onClick={handleCancel}
                  className="h-10 md:h-12 bg-transparent rounded-sm border-2 border-primary text-primary font-semibold focus-visible:ring-2 focus-visible:ring-ring hover:bg-primary/50 hover:scale-[1.02] disabled:bg-primary/50 transition-transform"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createProject.isPending || updateProject.isPending}
                  className="h-10 md:h-12 bg-primary rounded-sm text-white font-semibold focus-visible:ring-2 focus-visible:ring-ring hover:bg-primary/80 hover:scale-[1.02] disabled:bg-primary/80 transition-transform"
                >
                  {(isEditMode ? updateProject.isPending : createProject.isPending) ? (
                    <>
                      <LoaderCircle className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : isEditMode ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  );
};

/*
// OLD CODE - Commented out
"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, Plus, X } from "lucide-react";

interface AddProjectModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const AddProjectModal = ({ isOpen, setIsOpen }: AddProjectModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 z-55 bg-primary-subtle/60"
        onClick={() => setIsOpen(false)}
      />

      <div className="max-h-[95vh] w-full max-w-2xl z-60 bg-primary-foreground border-2 border-ring overflow-scroll no-scrollbar scroll-smooth tracking-tight">
        <div className="h-[10vh] border-b-2 border-primary flex items-center p-4">
          <h1 className="font-bold text-2xl">Add Project</h1>
        </div>
        <div className="h-full w-full p-4 pb-4">
          <form>
            <FieldGroup>
              <Field className="w-full py-2">
                <FieldLabel className="font-semibold text-foreground text-sm gap-0 leading-1.5">
                  Title
                </FieldLabel>
                <Input
                  type="text"
                  placeholder="Crazy Project"
                  className="rounded-sm h-10 md:h-12 border-2 border-border bg-input text-sm font-medium"
                />
                {errors.email && (
                  <FieldError className="text-error font-bold">
                    {errors.email?.message || "invalid email!"}
                  </FieldError>
                )}
              </Field>
              <Field className="w-full py-2">
                <FieldLabel className="font-semibold text-foreground text-sm gap-0 leading-1.5">
                  Description
                </FieldLabel>
                <Textarea
                  placeholder="This is Crazy Project..."
                  className="rounded-sm h-10 md:h-12 border-2 border-border bg-input text-sm font-medium"
                />
                {errors.email && (
                  <FieldError className="text-error font-bold">
                    {errors.email?.message || "invalid email!"}
                  </FieldError>
                )}
              </Field>
              <FieldSeparator />
              <Field>
                <FieldLabel className="font-semibold text-foreground text-sm gap-0 leading-1.5">
                  Status
                </FieldLabel>
                <div className="grid grid-cols-4 gap-2">
                  <Input
                    type="text"
                    placeholder="Todo"
                    className="rounded-sm h-10 md:h-12 border-2 border-border bg-input text-sm font-medium"
                  />
                  <Button
                    type="button"
                    className="h-10 md:h-12 bg-transparent border-primary rounded-sm text-primary font-semibold focus-visible:ring-2 focus-visible:ring-ring hover:bg-primary/50 hover:scale-[1.02] disabled:bg-primary/50 transition-transform"
                  >
                    {isPending ? (
                  <>
                    <LoaderCircle className="animate-spin" /> Login...
                  </>
                ) : (
                  "Submit"
                )}
                    <Plus /> Add
                  </Button>
                </div>
              </Field>
              <Field>
                <FieldLabel className="font-semibold text-foreground text-sm gap-0 leading-1.5">
                  Label
                </FieldLabel>
                <div className="grid grid-cols-4 gap-2">
                  <Input
                    type="text"
                    placeholder="High"
                    className="rounded-sm h-10 md:h-12 border-2 border-border bg-input text-sm font-medium"
                  />
                  <Button
                    type="button"
                    className="h-10 md:h-12 bg-transparent border-primary rounded-sm text-primary font-semibold focus-visible:ring-2 focus-visible:ring-ring hover:bg-primary/50 hover:scale-[1.02] disabled:bg-primary/50 transition-transform"
                  >
                    {isPending ? (
                  <>
                    <LoaderCircle className="animate-spin" /> Login...
                  </>
                ) : (
                  "Submit"
                )}
                    <Plus /> Add
                  </Button>
                </div>
              </Field>
              <Field>
                <FieldLabel className="font-semibold text-foreground text-sm gap-0 leading-1.5">
                  Priority
                </FieldLabel>
                <div className="grid grid-cols-4 gap-2">
                  <Input
                    type="text"
                    placeholder="Urgent"
                    className="rounded-sm h-10 md:h-12 border-2 border-border bg-input text-sm font-medium"
                  />
                  <Button
                    type="button"
                    className="h-10 md:h-12 bg-transparent border-primary rounded-sm text-primary font-semibold focus-visible:ring-2 focus-visible:ring-ring hover:bg-primary/50 hover:scale-[1.02] disabled:bg-primary/50 transition-transform"
                  >
                    {isPending ? (
                  <>
                    <LoaderCircle className="animate-spin" /> Login...
                  </>
                ) : (
                  "Submit"
                )}
                    <Plus /> Add
                  </Button>
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-4 py-4">
                <Button
                  type="button"
                  className="h-10 md:h-12 bg-transparent rounded-sm border-2 border-primary text-primary font-semibold focus-visible:ring-2 focus-visible:ring-ring hover:bg-primary/50 hover:scale-[1.02] disabled:bg-primary/50 transition-transform"
                >
                  {isPending ? (
                  <>
                    <LoaderCircle className="animate-spin" /> Login...
                  </>
                ) : (
                  "Submit"
                )}
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-10 md:h-12 bg-primary rounded-sm text-white font-semibold focus-visible:ring-2 focus-visible:ring-ring hover:bg-primary/80 hover:scale-[1.02] disabled:bg-primary/80 transition-transform"
                >
                  {isPending ? (
                  <>
                    <LoaderCircle className="animate-spin" /> Login...
                  </>
                ) : (
                  "Submit"
                )}
                  Submit
                </Button>
              </div>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  );
}
*/
