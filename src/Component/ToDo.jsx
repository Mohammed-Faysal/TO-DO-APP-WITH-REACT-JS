import React, { useEffect, useState } from "react";

const ToDo = () => {

    const [catchVal, setCatchVal] = useState("") // To catch the value of the input

    const [taskList, setTaskList] = useState(()=>{
        const todoItem = localStorage.getItem("AllTodos")
        return todoItem ? JSON.parse(todoItem) : []
    }) // To catch all the task and show in the list.

    const [isEdit, setIsEdit] = useState(false)

    const [editTaskIndex, setEditTaskIndex] = useState(null) // To catch the editTask index

    const [filter, setFilter] = useState("all")


    useEffect(()=> {
        localStorage.setItem("AllTodos", JSON.stringify(taskList))
    }, [taskList])


    const addTodos = (e) => {
        e.preventDefault()

        if(catchVal.trim() === ""){
            alert("Add a Task")
            return
        }

        if(isEdit){
            const updatedlist = taskList.map((item, i) => {
                return i === editTaskIndex ? {...item, task: catchVal} : item
            })

            setTaskList(updatedlist)
            setIsEdit(false)
        }

        else{
            const newTask = {
                id: Date.now() + '', // Unique Id for each todo
                task: catchVal, 
                status: 'pending'  // Initialize the status
            }
    
            setTaskList([newTask, ...taskList])
        }

        setCatchVal("")
    }

    const deleteTask = (item) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete this ${item.task} permanently`)
        if(confirmDelete){
            const updatedList = taskList.filter((task) => task.id !== item.id)

            setTaskList(updatedList)
        }
    }


    const editTask = (index) => {
        setIsEdit(true)
        setCatchVal(taskList[index].task)
        setEditTaskIndex(index)
    }

    const toggleStatus = (id) => {
        const updatedList = taskList.map((item) => {
           return item.id === id ? {...item, status: item.status === 'pending' ? 'complete' : 'pending'} : item
        })

        setTaskList(updatedList)
    }


    const filteredList = taskList.filter((item) => {
        if(filter === 'complete') return item.status === 'complete'
        if(filter === 'pending') return item.status === 'pending'
        return true // "all" case.
    })

    return (
        <div className="container">
            <form onSubmit={addTodos}>
                <input 
                
                    type="text"
                    value={catchVal}
                    onChange={(e)=> {
                        setCatchVal(e.target.value)
                    }}
                    
                />

                <button type="submit">{isEdit ? "Update Task" : "Add Task"}</button>
            </form>

            <div className="comPen">
                <button onClick={()=> setFilter('all')}>All Tasks</button>
                <button onClick={()=> setFilter('complete')}>Complete Tasks</button>
                <button onClick={()=> setFilter('pending')}>Pending Tasks</button>
            </div>

            <div className="todosContainer">

                {filteredList.length > 0 ? (
                    filteredList.map((item, index) => (
                        <div className='tasks' key={item.id}>
                        <div>
                            <input 
                                type="checkbox" 
                                checked={item.status === 'complete'}
                                onChange={()=> toggleStatus(item.id)}
                            />
                        </div>
    
                        <div className="todo">
                            <span style={{textDecoration: item.status === 'complete' ? 'line-through' : 'none'}}>{item.task}</span>
                            <div className='btn'>
                                <button className='edit' onClick={()=> editTask(index)}>Edit</button>
                                <button className='delete' onClick={()=> deleteTask(item)}>Delete</button>
                            </div>
                        </div>
                    </div>
                    ))
                ) : (<p>
                        {filter === 'complete' && 'There is no complete tasks'}
                        {filter === 'pending' && 'There is no pending tasks'}
                        {filter === 'all' && 'No tasks available here'}
                </p>)} 
            </div>

            <div className='counter'>
                {filter === 'all' && <span>All Tasks = {filteredList.length}</span>}
                {filter === 'complete' && <span>Complete Tasks = {filteredList.length}</span>}
                {filter === 'pending' && <span>Pending Tasks = {filteredList.length}</span>}
            </div>
        </div>
    );
};

export default ToDo;