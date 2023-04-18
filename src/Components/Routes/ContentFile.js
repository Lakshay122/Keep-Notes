import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Notes from '../Inventory/AllProducts/Notes';
import SingleNote from '../Inventory/AllProducts/SingleNote';
 export default function ContentFile({searchNotes}) {
  return (
        <>
            <Routes>
                <Route path='/'>
                    <Route index  element={<Notes searchNotes= {searchNotes} />}/>
                    <Route path='/note/:id' element={<SingleNote/>}/>
                </Route>
            </Routes> 
        </>
  )
}
