"use client"

import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import * as React from "react"

import { Label } from "@/components/ui/label"

import { cn } from "@/lib/utils"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
)

/**
 * Provides a react-hook-form Controller for a specific field and exposes that field's name to descendants via FormFieldContext.
 *
 * @param props - Controller props for the field; forwarded to the underlying `Controller`. The field `name` is also made available to descendant form components through `FormFieldContext`.
 * @returns The React element rendering the `Controller` wrapped in a `FormFieldContext.Provider`.
 */
function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
)

/**
 * Provides a form item container and supplies a unique `id` to descendants via FormItemContext.
 *
 * Renders a div with `data-slot="form-item"` and grid gap styling, merging any provided `className`, and wraps it in a FormItemContext.Provider whose value is an object with the generated `id`.
 *
 * @returns A JSX element containing the context provider and the form item container.
 */
function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

/**
 * Renders a form label bound to the current FormField and annotated with its error state.
 *
 * The label is linked to the field input via `htmlFor` (derived from the surrounding FormItem)
 * and exposes `data-error` indicating whether the field currently has an error.
 *
 * @returns A React element rendering a styled label for the active form field
 */
function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("font-heading", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

/**
 * Renders a form control wrapper that links the current field's ids and validation state to its DOM control for accessibility.
 *
 * @returns The Slot element configured with `id`, `aria-describedby`, and `aria-invalid` reflecting the field's description and error message.
 */
function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

/**
 * Renders the accessible description paragraph for the current form field.
 *
 * @returns A paragraph element whose `id` is the form field's description id and that accepts additional props and styling.
 */
function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-sm font-base text-foreground", className)}
      {...props}
    />
  )
}

/**
 * Renders the field's validation message or the component's children when present.
 *
 * If the field has a validation error, the error's message is shown; otherwise the component displays its children.
 *
 * @param props - Props forwarded to the underlying `<p>` element.
 * @returns The rendered `<p>` element containing the message, or `null` if there is no content to display.
 */
function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : props.children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-sm font-base text-red-500", className)}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}