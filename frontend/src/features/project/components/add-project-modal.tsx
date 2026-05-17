"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

        <div className="max-h-[95vh] w-full max-w-2xl z-60 bg-primary-foreground border-2 border-ring overflow-scroll no-scrollbar scroll-smooth tracking-tight">
          <div className="h-[10vh] border-b-2 border-primary flex items-center p-4">
            <h1 className="font-bold text-2xl">Add Project</h1>
          </div>
          <div className="h-full w-full p-4 pb-4">
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field className="w-full py-2">
                  <FieldLabel className="font-semibold text-foreground text-sm gap-0 leading-1.5">
                    Title <span className="text-red-500">*</span>
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
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="This is Crazy Project..."
                    className="rounded-sm h-20 md:h-24 border-2 border-border bg-input text-sm font-medium p-2 resize-none"
                    rows={3}
                  />
                </Field>

                <FieldSeparator />

                <Field className="w-full py-2">
                  <FieldLabel className="font-semibold text-foreground text-sm gap-0 leading-1.5">
                    Custom Fields
                  </FieldLabel>
                  <div className="flex flex-wrap gap-2 items-end">
                    {customFields.map((field) => (
                      <div
                        key={field.id}
                        className="flex items-center gap-2 px-2 py-1 border-2 border-border rounded-sm bg-input"
                      >
                        <Select
                          value={field.type}
                          onValueChange={(value) =>
                            updateCustomField(field.id, "type", value)
                          }
                        >
                          <SelectTrigger
                            className="px-2 py-1 border-2 border-border rounded-sm bg-background text-sm font-medium h-10 md:h-12"
                          >
                            <SelectValue placeholder="Field Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="status">Status</SelectItem>
                              <SelectItem value="priority">Priority</SelectItem>
                              <SelectItem value="label">Label</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <Input
                          type="text"
                          value={field.title}
                          onChange={(e) =>
                            updateCustomField(field.id, "title", e.target.value)
                          }
                          placeholder="Name"
                          className="h-8 rounded-sm border-2 border-border bg-input text-sm font-medium"
                        />

                        <Input
                          type="color"
                          value={field.color}
                          onChange={(e) =>
                            updateCustomField(field.id, "color", e.target.value)
                          }
                          className="h-8 w-8 rounded-sm cursor-pointer p-0 border-2 border-border"
                        />

                        <button
                          type="button"
                          onClick={() => removeCustomField(field.id)}
                          className="text-muted-foreground hover:text-foreground px-2 text-lg font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      onClick={addCustomField}
                      className="h-10 md:h-12 bg-transparent border-primary rounded-sm text-primary font-semibold focus-visible:ring-2 focus-visible:ring-ring hover:bg-primary/50 hover:scale-[1.02] disabled:bg-primary/50 transition-transform ml-auto"
                    >
                      <Plus /> Add Custom Field
                    </Button>
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
