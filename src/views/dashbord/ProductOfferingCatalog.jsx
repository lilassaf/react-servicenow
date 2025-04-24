import React, { useEffect, useState } from 'react';
import Table from '../../components/dashbord/ProductOfferingCatalog/Table';
import Form from '../../components/dashbord/ProductOfferingCatalog/Form';


function ProductOfferingCatalog() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null); 

  return (
    <>
      <div className='h-full'>
        <div className='h-36 bg-cyan-700/40 flex items-end py-3 px-20'>
          <div className='flex w-full justify-between'>

            <div class="relative w-48 transition-all focus-within:w-56 ">
              <input
                type="text"
                placeholder="Search..."
                id="searchInput"
                class="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border outline-none transition-all border-gray-300"
              />
              <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button
              class="overflow-hidden relative w-36 h-10 cursor-pointer flex items-center border border-cyan-700 bg-cyan-700 group hover:bg-cyan-700 active:bg-cyan-700 active:border-cyan-700"
               onClick={() => setOpen(true)}
            >
              <span
                class="text-gray-200 font-semibold ml-12 transform group-hover:translate-x-20 transition-all duration-300"
              >Add </span>

              <span
                class="absolute right-0 h-full w-10 rounded-lg bg-cyan-700 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300"
              >
                <i class="ri-add-line text-xl text-white font-semibold"></i>
              </span>
            </button>

          </div>
        </div>

        <div className='flex justify-center items-center py-5'>
          <Table setData={setData} setOpen={setOpen} ></Table>
        </div>
         
         <Form open={open} setOpen={setOpen} initialData={data} ></Form>


      </div>
    </>
  );
}

export default ProductOfferingCatalog;