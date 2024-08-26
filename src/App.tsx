// import { useState } from 'react'
import './App.css'
import Table from "./components/table/table"

function App() {
  return (
    <div className='flex flex-col items-start space-y-4'>
      <h1>Todos Manager</h1>
      <h1>Todos</h1>
      <Table/>
    </div>
  )
}

export default App
