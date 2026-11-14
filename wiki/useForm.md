# useForm

Controlled-form state with validation and async submission. Tracks values, per-field errors, and a submitting flag, and guards against stale reads during submit.

```js
import { useForm } from './shared/hooks/useForm';
```

---

## Signature

```ts
useForm(
  initialValues?: object,
  onSubmit: (values) => Promise<void> | void,
  validate?: (values) => Record<string, string>
): FormResult
```

---

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `initialValues` | `object` | `{}` | Starting field values. |
| `onSubmit` | `function` | — | Called with the current values on a valid submit. May be async; thrown errors surface under `errors.submit`. |
| `validate` | `function` | — | Optional. Returns a `{ field: message }` map. A non-empty map blocks submission and populates `errors`. |

---

## Return value

| Key | Type | Description |
|-----|------|-------------|
| `formData` | `object` | Current field values. |
| `setFormData` | `function` | Replace the whole values object. |
| `errors` | `object` | Current `{ field: message }` errors (includes `submit` for failed submissions). |
| `setErrors` | `function` | Replace the errors object. |
| `isSubmitting` | `boolean` | `true` while `onSubmit` is in flight. |
| `handleChange(e)` | `function` | Change handler for inputs; reads `name`, `value`/`checked`, and clears that field's error. |
| `setFieldValue(name, value)` | `function` | Set one field programmatically. |
| `setFields(partial)` | `function` | Merge several fields at once. |
| `handleSubmit(e?)` | `function` | Prevents default, validates, runs `onSubmit`. Returns `true` on success, `false` otherwise. |
| `reset()` | `function` | Reset back to `initialValues`. |
| `resetTo(values)` | `function` | Reset to a specific set of values (handy when opening an edit form). |

---

## Behavior notes

- **Checkboxes** are handled automatically (`handleChange` uses `checked` for `type="checkbox"`).
- **Stale-read safe.** `handleSubmit` reads the latest values from a ref, so a blur-then-submit race can't submit outdated data.
- **Error clearing.** Typing in a field clears that field's error immediately for responsive feedback.
- **Submit failures.** If `onSubmit` throws, the message lands in `errors.submit` and `isSubmitting` returns to `false`.

---

## Recipe — create / edit form

```js
function UserForm({ existing, onSave }) {
  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetTo,
  } = useForm(
    { name: '', email: '' },
    async (values) => { await onSave(values); },
    (values) => {
      const e = {};
      if (!values.name) e.name = 'Name is required';
      if (!/.+@.+/.test(values.email)) e.email = 'Invalid email';
      return e;
    }
  );

  // Populate when editing an existing record
  useEffect(() => { if (existing) resetTo(existing); }, [existing, resetTo]);

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} />
      {errors.name && <small>{errors.name}</small>}

      <input name="email" value={formData.email} onChange={handleChange} />
      {errors.email && <small>{errors.email}</small>}

      {errors.submit && <p role="alert">{errors.submit}</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save'}
      </button>
    </form>
  );
}
```

---

## React primitives used

| Primitive | Role in the hook |
|-----------|------------------|
| `useState` | Values, errors, and submitting state. |
| `useRef` + `useEffect` | Hold the latest values to avoid stale reads at submit time. |
| `useCallback` | Stable handlers for change/submit/reset. |

---

## See also

- [[useModal]] — pairs well for modal-based forms
- [[Home]]
