import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { updateProductOffering, createProductOffering,  } from '../../../features/servicenow/product-offering/productOfferingSlice';




const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    start_date: Yup.string().required('Start date is required'),
    end_date: Yup.string(),
    description: Yup.string(),
    recurring_price: Yup.string(), // Initialize as string for input control
    non_recurring_price: Yup.string(), // Initialize as string
    po_term: 'not_applicable', // Default value
    p_spec: Yup.string().required('Product Specification is required'), // Product Specification ID
    channel: Yup.string().required('Channel is required'), // Channel ID
    category: Yup.string().required('Category is required'), // Category ID
});

function ProductOfferingForm({ open, setOpen, initialData = null }) {
  const dispatch = useDispatch();
  const isEditMode = Boolean(initialData);

  const formik = useFormik({
    initialValues: {
        start_date: initialData.validFor?.startDateTime?.split('T')[0] || '', // Handle potential timestamp
        end_date: initialData.validFor?.endDateTime?.split('T')[0] || '',     // Handle potential timestamp
        description: initialData.description || '',
        recurring_price: recurring?.price?.taxIncludedAmount?.value ?? '', // Use nullish coalescing
        non_recurring_price: nonRecurring?.price?.taxIncludedAmount?.value ?? '', // Use nullish coalescing
        po_term: initialData.productOfferingTerm || 'not_applicable',
        p_spec: initialData.productSpecification?.id || '', // Get ID from nested object
        channel: initialData.channel?.[0]?.id || '', // Get ID from first item in array
        category: initialData.category[0]?.id || '', // Get ID from nested object
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const action = isEditMode
          ? updateProductOffering({ id: initialData.id, ...values })
          : createProductOffering(values);
        await dispatch(action).unwrap();
        setOpen(false);
      } catch (error) {
        console.error('Submission error:', error);
      }
    },
    enableReinitialize: true,
  });

  

  const handleCancel = () => setOpen(false);

  return (
    <Modal
      title={isEditMode ? 'Edit Record ' : 'Add New Record'}
      open={open}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
            className="w-full border rounded px-3 py-2"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
          )}
        </div>

       

        {/* Start Date */}
        <div>
          <label className="block font-medium mb-1">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={formik.values.start_date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
            className="w-full border rounded px-3 py-2"
          />
          {formik.touched.start_date && formik.errors.start_date && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.start_date}</p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label className="block font-medium mb-1">End Date (Optional)</label>
          <input
            type="date"
            name="end_date"
            value={formik.values.end_date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
            className="w-full border rounded px-3 py-2"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
            <option value="retired">Retired</option>
          </select>
          {formik.touched.status && formik.errors.status && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.status}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows="3"
            disabled={formik.isSubmitting}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={formik.isSubmitting}
            className="px-4 py-2 rounded border bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {formik.isSubmitting
              ? isEditMode
                ? 'Updating...'
                : 'Creating...'
              : isEditMode
              ? 'Update Record'
              : 'Create Record'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ProductOfferingForm;
