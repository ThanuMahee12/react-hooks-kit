import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Manage form state, validation, and submission.
 *
 * @param {Object}   initialValues  Initial form values.
 * @param {Function} onSubmit       async (values) => void — called on valid submit.
 * @param {Function} [validate]     (values) => errors — return a map of field -> message.
 * @returns {Object} Form state and handlers.
 */
export const useForm = (initialValues = {}, onSubmit, validate) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep a ref to the latest formData so handleSubmit never reads a stale value
  // (e.g. when an onBlur and the submit race).
  const formDataRef = useRef(formData);
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const setFieldValue = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setFields = useCallback((fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  }, []);

  const reset = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  const resetTo = useCallback((values) => {
    setFormData(values);
    setErrors({});
    setIsSubmitting(false);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      const currentData = formDataRef.current;

      if (validate) {
        const validationErrors = validate(currentData);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return false;
        }
      }

      setIsSubmitting(true);
      setErrors({});

      try {
        await onSubmit(currentData);
        return true;
      } catch (error) {
        setErrors({ submit: error.message || 'Submission failed' });
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, validate]
  );

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    isSubmitting,
    handleChange,
    setFieldValue,
    setFields,
    handleSubmit,
    reset,
    resetTo,
  };
};

export default useForm;
