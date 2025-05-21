import React from 'react'

import './style.css'

const Loader = () => {
  return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      
<div class="loader">
  <div class="box box-1">
    <div class="side-left"></div>
    <div class="side-right"></div>
    <div class="side-top"></div>
  </div>
  <div class="box box-2">
    <div class="side-left"></div>
    <div class="side-right"></div>
    <div class="side-top"></div>
  </div>
  <div class="box box-3">
    <div class="side-left"></div>
    <div class="side-right"></div>
    <div class="side-top"></div>
  </div>
  <div class="box box-4">
    <div class="side-left"></div>
    <div class="side-right"></div>
    <div class="side-top"></div>
  </div>
</div>
    </div>
  )
}

export default Loader