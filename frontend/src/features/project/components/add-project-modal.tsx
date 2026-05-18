"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useState } from "react";

interface CustomField {
    id: string;
    type: "status" | "priority" | "label";
    title: string;
    color: string;
}

interface AddProjectModalProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

export const AddProjectModal = ({ isOpen, setIsOpen }: AddProjectModalProps) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [customFields, setCustomFields] = useState<CustomField[]>([]);

    const addCustomField = () => {
        setCustomFields([
            ...customFields,
            {
                id: crypto.randomUUID(),
                type: "status",
                title: "",
                color: "#000000",
            },
        ]);
    };

    const updateCustomField = (id: string, field: keyof CustomField, value: string) => {
        setCustomFields(
            customFields.map((cf) =>
                cf.id === id ? { ...cf, [field]: value } : cf
            )
        );
    };

    const removeCustomField = (id: string) => {
        setCustomFields(customFields.filter((cf) => cf.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ title, description, customFields });
        // TODO: Call API to create project
        setTitle("");
        setDescription("");
        setCustomFields([]);
        setIsOpen(false);
    };

    const handleCancel = () => {
        setTitle("");
        setDescription("");
        setCustomFields([]);
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 z-55 bg-primary-subtle/60"
          onClick={handleCancel}
        />

        <div className="max-h-[95vh] w-full max-w-2xl z-60 bg-primary-foreground border-2 border-ring tracking-tight">
          <div className="h-[10vh] border-b-2 border-primary flex items-center p-4">
            <h1 className="font-bold text-2xl">Add Project</h1>
          </div>
          <div className="h-full w-full p-4 pb-4">
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field className="w-full py-2">
                  <FieldLabel className="font-semibold text-foreground text-sm gap-0 leading-1.5">
                    Title
                  </FieldLabel>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Crazy Project"
                    className="rounded-sm h-10 md:h-12 border-2 border-border bg-input text-sm font-medium"
                    required
                  />
                </Field>

                <Field className="w-full py-2">
                  <FieldLabel className="font-semibold text-foreground text-sm gap-0 leading-1.5">
                    Description
                  </FieldLabel>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="This is Crazy Project..."
                    className="rounded-sm h-20 md:h-24 border-2 border-border bg-input text-sm font-medium resize-none"
                    rows={3}
                  />
                </Field>

                <FieldSeparator />

                <Field className="max-h-36 w-full py-2 overflow-scroll no-scrollbar scroll-smooth">
                  <div className="flex items-center justify-between mb-2">
                    <FieldLabel className="font-semibold text-foreground text-sm gap-0 leading-1.5 m-0">
                      Custom Fields
                    </FieldLabel>
                    <Button
                      type="button"
                      onClick={addCustomField}
                      className="h-8 px-3 bg-transparent border-2 border-primary rounded-sm text-primary text-sm font-semibold focus-visible:ring-2 focus-visible:ring-ring hover:bg-primary/50 disabled:bg-primary/50 transition-transform"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {customFields.length === 0 ? (
                      <div className="text-center py-6 border-2 border-dashed border-border rounded-sm text-muted-foreground text-sm">
                        No custom fields yet. Click "Add" to create one.
                      </div>
                    ) : (
                      customFields.map((field) => (
                        <div
                          key={field.id}
                          className="flex items-center gap-3 p-3 border-2 border-border rounded-sm bg-input"
                        >
                          <Select
                            value={field.type}
                            onValueChange={(value) =>
                              updateCustomField(field.id, "type", value)
                            }
                          >
                            <SelectTrigger className="w-32 h-9 border-2 border-border rounded-sm bg-background text-sm font-medium">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent className=" bg-primary-foreground">
                              <SelectGroup>
                                <SelectItem value="label">Project Label</SelectItem>
                                <SelectItem value="status">Task Status</SelectItem>
                                <SelectItem value="priority">
                                  Task Priority
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>

                          <Input
                            type="text"
                            value={field.title}
                            onChange={(e) =>
                              updateCustomField(
                                field.id,
                                "title",
                                e.target.value,
                              )
                            }
                            placeholder="Field name..."
                            className="flex-1 h-9 min-w-0 rounded-sm border-2 border-border bg-input text-sm font-medium"
                          />

                          <div className="flex items-center gap-2">
                            <div className="relative w-9 h-9 shrink-0">
                              <Input
                                type="color"
                                defaultValue="#000000"
                                value={field.color}
                                onChange={(e) =>
                                  updateCustomField(
                                    field.id,
                                    "color",
                                    e.target.value,
                                  )
                                }
                                className="absolute inset-0 w-full h-full rounded-sm cursor-pointer border-2 border-border p-0.5"
                              />
                            </div>
                            <Input
                              type="text"
                              value={field.color}
                              onChange={(e) =>
                                updateCustomField(
                                  field.id,
                                  "color",
                                  e.target.value,
                                )
                              }
                              className="w-20 h-9 rounded-sm border-2 border-border bg-input text-sm font-mono"
                              maxLength={7}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeCustomField(field.id)}
                              className="h-9 w-9 shrink-0 hover:bg-destructive/10 hover:text-destructive"
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      ))
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
                    disabled={!title}
                    className="h-10 md:h-12 bg-primary rounded-sm text-white font-semibold focus-visible:ring-2 focus-visible:ring-ring hover:bg-primary/80 hover:scale-[1.02] disabled:bg-primary/80 transition-transform"
                  >
                    Submit
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
