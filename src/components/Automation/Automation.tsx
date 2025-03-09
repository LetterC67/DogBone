import React, { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useAgent } from "../../context/AgentContext";
import { useData } from "../../context/DataContext";
import { FaDog } from "react-icons/fa";
import { triggerTask, cancelTask } from "../../api/agent";
import { toast } from 'react-toastify';
import Spinner from "../Common/Spinner";

function formatFrequency(minutes) {
  if (minutes % (60 * 24 * 365) === 0) {
      return `Every ${minutes / (60 * 24 * 365)} year(s)`;
  } else if (minutes % (60 * 24 * 30) === 0) {
      return `Every ${minutes / (60 * 24 * 30)} month(s)`;
  } else if (minutes % (60 * 24 * 7) === 0) {
      return `Every ${minutes / (60 * 24 * 7)} week(s)`;
  } else if (minutes % (60 * 24) === 0) {
      return `Every ${minutes / (60 * 24)} day(s)`;
  } else if (minutes % 60 === 0) {
      return `Every ${minutes / 60} hour(s)`;
  } else {
      return `Every ${minutes} minute(s)`;
  }
}
function Automation() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
    const { authenticated } = usePrivy();
    const {sendAutomationMessage} = useAgent();
  const { automatedTasks, setAutomatedTasks } = useData();
  const { isAnswering } = useAgent();
  

  const openLogsModal = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const closeLogsModal = () => {
    setSelectedTask(null);
    setShowModal(false);
  };

  const handleSendMessage = async () => {
    if (!authenticated) return;
    if (message.trim()) {
        await sendAutomationMessage (message);
        setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  async function startStopTask(Task) {
    let result = "";
    try {
      result = await triggerTask(Task.id);
    } catch {
      toast.error(`Failed to ${(Task.status === "Paused" || Task.status === "") ? "start" : "pause"} task ${Task.name}`,
        {
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
        }
    );
    return;
    }

    toast.success(`Task ${Task.name} has been ${(Task.status === "Paused" || Task.status === "") ? "started" : "paused!"}`,
        {
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
        }
    );

    console.log(result);

    // Change the status of the task to result
    setAutomatedTasks((prevTasks: any[]) =>
      prevTasks.map((task) =>
        task.id === Task.id ? { ...task, status: result } : task
      )
    );
  }

  async function _cancelTask(Task) {
    let result
    try {
      result = await cancelTask(Task.id);
    } catch {
      toast.error(`Failed to cancel task ${Task.name}`,
        {
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
        }
    );
    return;
    }

    toast.success(`Task ${Task.name} has been canceled`,
        {
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
        }
    );

    // Remove the task from the list
    setAutomatedTasks((prevTasks: any[]) =>
      prevTasks.filter((task) => task.id !== Task.id)
    );
  }


  return (
    <>
        <div className="hahaha !shadow flex flex-col w-full h-full ">
        <div className="overflow-y-scroll bg-[var(--background)] text-[var(--primary)] pt-6 w-full h-full">
            <div className="max-w-4xl mx-auto">
            <h1 className="text-md font-semibold mb-6 text-[var(--highlight)] bg-[var(--secondary)] border border-[var(--divider)] rounded-2xl p-6 py-4 text-center">
                <div>
                ⚠️ The Automation feature is currently under development. You can still create tasks, but they will not be executed! 
                </div>
            </h1>

            <h2 className="text-lg font-semibold text-[var(--highlight)] mb-4 flex flex-row gap-2">
                Create a Task
                {isAnswering && <Spinner />}
            </h2>
            <input disabled={isAnswering || !authenticated} onKeyDown={handleKeyDown} type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full p-4 rounded-2xl bg-[var(--accent)] text-[var(--primary)] text-md font-semibold mb-6" placeholder={authenticated ? `What do you want to automate?` : `Please login first!`} />

            <h2 className="text-lg font-semibold text-[var(--highlight)] mb-4">
                Your Tasks
            </h2>

            {(automatedTasks.length == 0) && <>
                <div className="flex flex-col items-center justify-center gap-4 p-6">
                <FaDog className="text-[var(--highlight)] text-9xl" />
                <div className="text-lg font-semibold text-[var(--highlight)]">
                    No tasks yet. Create one above!
                </div>
                </div>
            </>}

            {(automatedTasks.length > 0) && automatedTasks.map((task) => (
                <div
                key={task.name}
                className="bg-[var(--secondary)] border border-[var(--divider)] rounded-2xl p-6 py-4 mb-6 transition-transform hover:-translate-y-1"
                >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="text-lg font-semibold text-[var(--highlight)]">
                    {task.name}
                    </div>
                    <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 bg-[var(--accent${(task.status === "Paused" || task.status == "") ? '' : '-2'})] ${(task.status === "Paused" || task.status == "") ? 'text-[var(--highlight)]' : 'text-[var(--primary)]'} text-md font-semibold px-3 py-1 rounded-full`}>
                        <span role="img" aria-label="clock">
                        {(task.status === "Paused" || task.status == "") ? "🔴" : "🟢"}
                        </span>
                        {(task.status === "Paused" || task.status == "") ? "Task paused" : "Task active"}
                    </span>
                    {/* Interval badge */}
                    <span className="inline-flex items-center gap-1 bg-[var(--accent-2)] text-[var(--primary)] text-md font-semibold px-3 py-1 rounded-full">
                        <span role="img" aria-label="clock">
                        ⏰
                        </span>
                        {formatFrequency(task.interval)}
                    </span>
                    {/* Type badge */}
                    <span className="inline-flex items-center gap-1 bg-[var(--accent-2)] text-[var(--primary)] text-md font-semibold px-3 py-1 rounded-full">
                        <span role="img" aria-label="type">
                        {task.type === "Repeated" ? "♻️" : "⛔️"}
                        </span>
                        {task.type}
                    </span>
                    </div>
                </div>

                <div>
                  {task.status == "" && <div className="text-[var(--highlight)] text-sm mb-4">
                    
                    <div>Make sure the execution flow below is correct before starting the task!</div>
                  </div>}
                    
                </div>

                <pre className="bg-[var(--accent-3)] rounded-md p-4 text-sm overflow-x-auto mb-4">
                    {task.pseudo_code}
                </pre>

                <div className="flex gap-4">
                    <button
                    onClick={() => openLogsModal(task)}
                    className="bg-[var(--accent-2)] text-[var(--primary)] px-4 py-2 rounded-2xl hover:opacity-80 hover:cursor-pointer transition font-semibold"
                    >
                    Show Logs
                    </button>
                    <button
                    onClick={() => startStopTask(task)}
                    className={`bg-[var(--accent${!(task.status === "Paused" || task.status == "") ? '' : '-2'})] ${!(task.status === "Paused" || task.status == "") ? 'text-[var(--highlight)]' : 'text-[var(--primary)]'} px-4 py-2 rounded-2xl hover:opacity-80 hover:cursor-pointer transition font-semibold`}
                    >
                    {(task.status === "Paused" || task.status == "") ? "Start Task" : "Stop Task"}
                    </button>
                    <button
                    onClick={() => _cancelTask(task)}
                    className="bg-[var(--accent)] text-[var(--highlight)] px-4 py-2 rounded-2xl hover:opacity-80 hover:cursor-pointer transition font-semibold"
                    >
                    Cancel Task
                    </button>
                </div>
                </div>
            ))}
            </div>

        </div>
            {/* Logs Modal */}
            {showModal && selectedTask && (
            <div
                className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                onClick={closeLogsModal}
            >
                <div
                className="max-w-2xl w-11/12 bg-[var(--secondary)] p-6 rounded-md relative border border-[var(--divider)] overflow-y-auto max-h-[70vh]"
                onClick={(e) => e.stopPropagation()} // Prevent outside click from closing content
                >
                <button
                    className="absolute top-4 right-4 text-[var(--primary)] text-xl focus:outline-none"
                    onClick={closeLogsModal}
                >
                    &times;
                </button>
                <h2 className="text-xl font-semibold text-[var(--highlight)] mb-4">
                    {selectedTask.name} Logs
                </h2>
                <div className="bg-[var(--accent-3)] border border-[var(--divider)] p-4 rounded-md text-sm whitespace-pre-wrap text-[var(--primary)]">
                    {selectedTask.logs.trim() || "No logs available"}
                </div>
                </div>
            </div>
            )}
        </div>
    </>
  );
}

export default Automation;
