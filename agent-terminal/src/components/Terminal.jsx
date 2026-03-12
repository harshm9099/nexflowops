import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Terminal as TerminalIcon } from 'lucide-react';

const AI_TASKS = [
  {
    title: "Step 1 - Browser Automation",
    steps: [
      { text: "AI Agent opening browser...", type: "action" },
      { text: 'Searching: "best flights Mumbai to Delhi"', type: "info" },
      { text: "Comparing prices...", type: "action" },
      { text: "Selecting best option...", type: "action" },
      { text: "Ticket booked successfully", type: "success" }
    ]
  },
  {
    title: "Step 2 - Ecommerce Automation",
    steps: [
      { text: "Opening online store...", type: "action" },
      { text: 'Searching product: "office chair"', type: "info" },
      { text: "Comparing 12 products...", type: "action" },
      { text: "Best product selected", type: "success" },
      { text: "Added to cart", type: "success" },
      { text: "Order placed", type: "success" }
    ]
  },
  {
    title: "Step 3 - CRM Automation",
    steps: [
      { text: "Connecting to CRM...", type: "action" },
      { text: "New lead detected", type: "info" },
      { text: "Lead: Name: Rahul Sharma, Company: TechNova", type: "info" },
      { text: "AI analyzing lead...", type: "action" },
      { text: "Lead qualified", type: "success" },
      { text: "Follow-up email sent", type: "success" }
    ]
  },
  {
    title: "Step 4 - Workflow Automation",
    steps: [
      { text: "Deploying automation pipeline...", type: "action" },
      { text: "Zoho CRM connected", type: "success" },
      { text: "WhatsApp bot active", type: "success" },
      { text: "Lead capture workflow running", type: "success" }
    ]
  }
];

const TerminalLine = ({ text, type, index }) => {
  const getIcon = () => {
    switch (type) {
      case "success": return <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0 mt-0.5" />;
      case "action": return <ArrowRight className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0 mt-0.5" />;
      case "info": return <span className="text-purple-400 mr-2 font-bold flex-shrink-0 mt-0.5">{">"}</span>;
      case "final": return <span className="w-2 h-2 rounded-full bg-green-500 mr-2 flex-shrink-0 mt-1.5 animate-pulse shadow-[0_0_8px_#22c55e]"></span>;
      default: return null;
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success": return "text-green-300";
      case "action": return "text-cyan-300";
      case "info": return "text-purple-300";
      case "final": return "text-green-400 font-bold tracking-wide";
      default: return "text-gray-300";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start my-1 ${getTextColor()} ${type === "final" ? "mt-6 border border-green-500/20 bg-green-500/10 p-3 rounded" : ""}`}
    >
      {type === "title" ? (
        <span className="text-cyan-400 font-bold mb-2 block w-full mt-4">
          <span className="mr-2">{">"}</span> {text}
        </span>
      ) : (
        <>
          {getIcon()}
          <span className="opacity-90">{text}</span>
        </>
      )}
    </motion.div>
  );
};

export default function Terminal() {
  const [visibleLines, setVisibleLines] = useState([]);
  const [isTyping, setIsTyping] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    let currentTask = 0;
    let currentStep = -1; // -1 means title, 0+ means steps
    let timeoutId;
    let isFinalMsgShown = false;

    const processNextLine = () => {
      if (currentTask >= AI_TASKS.length) {
        if (!isFinalMsgShown) {
          setVisibleLines(prev => [...prev, { text: "Nexflow AI Agent Status: ONLINE", type: "final", id: Date.now() }]);
          isFinalMsgShown = true;
          setIsTyping(false);
          timeoutId = setTimeout(() => {
            setVisibleLines([]);
            currentTask = 0;
            currentStep = -1;
            isFinalMsgShown = false;
            processNextLine();
          }, 5000); // 5 sec before restart
        }
        return;
      }

      const task = AI_TASKS[currentTask];
      
      if (currentStep === -1) {
        // Add title
        setVisibleLines(prev => [...prev, { text: task.title, type: "title", id: Date.now() }]);
        currentStep = 0;
        setIsTyping(true);
        timeoutId = setTimeout(processNextLine, 800);
      } else if (currentStep < task.steps.length) {
        // Add step
        const step = task.steps[currentStep];
        
        // Vary timing based on type
        let delay = 300;
        if (step.type === "action") delay = 800 + Math.random() * 500;
        if (step.text.includes("complete") || step.text.includes("successfully") || step.text.includes("selected")) delay = 1000;

        timeoutId = setTimeout(() => {
          setVisibleLines(prev => [...prev, { ...step, id: Date.now() }]);
          currentStep++;
          processNextLine();
        }, delay);
      } else {
        // Task complete, move to next
        currentTask++;
        currentStep = -1;
        setIsTyping(false);
        timeoutId = setTimeout(processNextLine, 2000); // Wait between tasks
      }
    };

    // Start sequence
    timeoutId = setTimeout(processNextLine, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLines]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="glass-window rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/10 border border-slate-700/50 flex flex-col h-[450px] lg:h-[500px]">
        {/* Terminal Header */}
        <div className="bg-slate-950/50 backdrop-blur-md border-b border-white/5 py-3 px-4 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border border-red-600/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 border border-yellow-600/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 border border-green-600/50"></div>
          </div>
          <div className="flex items-center text-xs text-slate-400 font-mono">
            <TerminalIcon className="w-3 h-3 mr-2" />
            agent-terminal ~ NexflowOps AI
          </div>
          <div className="w-12"></div> {/* Spacer for centering */}
        </div>
        
        {/* Terminal Body */}
        <div 
          ref={scrollRef}
          className="p-5 font-mono text-sm sm:text-base flex-1 overflow-y-auto scroll-smooth hide-scrollbar bg-slate-950/80"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {visibleLines.map((line, i) => (
            <TerminalLine key={line.id} text={line.text} type={line.type} index={i} />
          ))}
          
          <div className="flex items-center mt-2 text-cyan-400">
            <span className="mr-2">{">"}</span>
            {isTyping && (
              <motion.span 
                animate={{ opacity: [1, 0] }} 
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="w-2.5 h-5 bg-cyan-400 inline-block align-middle"
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
