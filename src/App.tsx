import TaskTable from "./components/table"

function App() {
  return (
    <div className='flex flex-col items-start space-y-4 bg-slate-50 py-10 px-5'>
      <div className='flex flex-col space-y-2 items-start'><h1 className='font-bold'>Todos Manager</h1>
      <h2 className='font-medium'>Todos</h2></div>
      <TaskTable/>
    </div>
  )
}

export default App
