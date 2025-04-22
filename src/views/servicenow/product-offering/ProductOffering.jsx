import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getall,
  getOne,
  createProductOffering,
  updateProductOffering,
  updateProductOfferingStatus,  // Corrected action name
  deleteProductOffering
} from '../../../features/servicenow/product-offering/productOfferingSlice';
import { getall as getSpecs } from '../../../features/servicenow/product-specification/productSpecificationSlice';
import { getall as getCats } from '../../../features/servicenow/product-offering/productOfferingCategorySlice';
import { getall as getChannels } from '../../../features/servicenow/channel/channelSlice';
import Table from '../../../utils/table/Table';
import ProductOfferingForm from '../../../components/servicenow/product offering/ProductOfferingForm';

function ProductOffering() {
  const dispatch = useDispatch();

  // Selectors
  const { data: specs, loading: specsLoading, error: specsError } = useSelector(
    (state) => state.productSpecification
  );
  const { data: products, selectedProduct, loading, error } = useSelector(
    (state) => state.productOffering
  );
  const { data: cats, loading: catsLoading, error: catsError } = useSelector(
    (state) => state.productOfferingCategory
  );
  const { data: channels, loading: channelsLoading, error: channelsError } =
    useSelector((state) => state.channel);

   // --- Modal State ---
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // For creation
   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // For update
   const [recordToEdit, setRecordToEdit] = useState(null); // Data for editing
  
  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      dispatch(getall());
      dispatch(getSpecs());
      dispatch(getCats());
      dispatch(getChannels());
    } else {
      console.error('Auth token not found. Please login.');
    }
  }, [dispatch]);

 

 // --- Modal Control Handlers ---
 const handleOpenCreateModal = () => setIsCreateModalOpen(true);
 const handleCloseCreateModal = () => setIsCreateModalOpen(false);

 const handleOpenUpdateModal = (id) => {
     // Find the product offering record by its ID
     const record = products.find(p => (p.id || p.sys_id) === id); // Use correct ID field if different
     if (record) {
         setRecordToEdit(record);
         setIsUpdateModalOpen(true);
     } else {
         console.error(`Could not find product offering with id: ${id} to edit.`);
         alert("Could not find record to edit.");
     }
 };

 const handleCloseUpdateModal = () => {
     setIsUpdateModalOpen(false);
     setRecordToEdit(null); // Clear editing state
 };


  const handleUpdateStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'draft' ? 'published' : 'retired';
    const databody = {"sys_id": id, "status": newStatus}

    if (window.confirm(`Are you sure you want to ${newStatus} this product offering?`)) {
      dispatch(updateProductOfferingStatus(databody))  // Fixed action name
        .unwrap()
        .then(() => {
          alert(`Product offering ${newStatus}!`);
          dispatch(getall());
        })
        .catch((err) => {
          console.error('Status update failed:', err);
          alert(`Error: ${err?.message || 'Update failed'}`);
        });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      dispatch(deleteProductOffering(id))
        .unwrap()
        .then(() => dispatch(getall()))
        .catch(console.error);
    }
  };

// --- Form Submission Handlers ---
const handleCreateSubmit = (productOfferingData) => {
  return dispatch(createProductOffering(productOfferingData))
      .unwrap()
      .then(() => {
          alert('Product Offering created successfully!');
          handleCloseCreateModal();
          dispatch(getall()); // Refresh list
      })
      .catch((err) => {
          alert(`Error creating product offering: ${err?.message || 'Unknown error'}`);
      });
};

// Handler for submitting the UPDATE form
const handleUpdateSubmit = (editedData) => {
  if (!recordToEdit) return; // Safety check

  const idToUpdate = recordToEdit.id || recordToEdit.sys_id; // Get ID

  // Dispatch the update action with ID and formatted data
  return dispatch(updateProductOffering({ id: idToUpdate, ...editedData }))
      .unwrap()
      .then(() => {
          alert('Product Offering updated successfully!');
          handleCloseUpdateModal(); // Close update modal
          dispatch(getall()); // Refresh list
      })
      .catch((err) => {
          console.error("Failed to update product offering:", err);
          alert(`Error updating product offering: ${err?.message || 'Unknown error'}`);
      });
};

  // Table configuration
  const colNames = ['Name', 'Description', 'Product Specification', 'Start Date', 'End Date'];
  const colBodyContent = products.map((product) => (product !== undefined && product.status!=="retired" && product.status!=="archived" ? {
    id: product.id,
    status: product.status,
    content: [
      product.displayName,
      product.description,
      product.productSpecification?.name || 'N/A',  // Added null safety
      product.validFor.startDateTime,
      product.validFor.endDateTime,
    ],
  } : ""));

  // Loading and error states
  const initialLoading = loading || specsLoading || catsLoading || channelsLoading;
  
  if (initialLoading && products.length === 0 && !isCreateModalOpen && !isUpdateModalOpen) {
    return <div>Loading initial data...</div>;
  }

  // Styling
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
  };

  const addButtonStyle = {
    padding: '10px 15px',
    marginBottom: '20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Product Offerings</h1>

      {/* Error displays */}
      {error && <div className="error-message">{error}</div>}
      {catsError && <div className="error-message">{catsError}</div>}
      {specsError && <div className="error-message">{specsError}</div>}
      {channelsError && <div className="error-message">{channelsError}</div>}

      <button onClick={handleOpenCreateModal} style={addButtonStyle} disabled={initialLoading}>
        Add New Product Offering
      </button>

      {products.length > 0 ? (
        <Table
          colNames={colNames}
          colBodyContent={colBodyContent}
          onDelete={handleDelete}
          onUpdateStatus={handleUpdateStatus}
          onStatusToggle={handleUpdateStatus}
          onUpdate={handleOpenUpdateModal}
          stateManage={true}
        />
      ) : (
        !initialLoading && <div style={{ marginTop: '20px' }}>No product offerings found.</div>
      )}

      {/* --- Modal for Adding --- */}
      {isCreateModalOpen && (
                <div style={modalOverlayStyle} onClick={handleCloseCreateModal}>
                    <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                        <ProductOfferingForm
                           // key="create-po" // Optional key
                            onSubmit={handleCreateSubmit}
                            onCancel={handleCloseCreateModal}
                            isLoading={loading} // Use PO loading state for submit
                            specs={specs}
                            cats={cats}
                            channels={channels}
                            specsLoading={specsLoading}
                            catsLoading={catsLoading}
                            channelsLoading={channelsLoading}
                            // initialData={null} // Default is null
                        />
                    </div>
                </div>
            )}

            {/* --- Modal for Updating --- */}
            {isUpdateModalOpen && recordToEdit && (
                 <div style={modalOverlayStyle} onClick={handleCloseUpdateModal}>
                     <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                         <ProductOfferingForm
                            // Force re-render/state reset when editing different items
                             key={recordToEdit.id || recordToEdit.sys_id}
                             onSubmit={handleUpdateSubmit} // Use the update handler
                             onCancel={handleCloseUpdateModal}
                             isLoading={loading} // Use PO loading state for submit
                             specs={specs}
                             cats={cats}
                             channels={channels}
                             specsLoading={specsLoading}
                             catsLoading={catsLoading}
                             channelsLoading={channelsLoading}
                             initialData={recordToEdit} // Pass data to pre-fill
                         />
                     </div>
                 </div>
             )}
    </div>
  );
}

export default ProductOffering;