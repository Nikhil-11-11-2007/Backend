import { useState, useRef, useEffect } from 'react';
import { MessageInput } from '../components/MessageInput';
import { MessageBubble } from '../components/MessageBubble';

const MOCK_AI_RESPONSE = {
  problem: "**Find the duplicated number in an array**\n\nGiven an array of integers `nums` containing `n + 1` integers where each integer is in the range `[1, n]` inclusive. There is only one repeated number in `nums`, return this repeated number.",
  solution_1: "```javascript\nfunction findDuplicate(nums) {\n  const seen = new Set();\n  for (let num of nums) {\n    if (seen.has(num)) return num;\n    seen.add(num);\n  }\n}\n```\n\nThis approach uses a Set to keep track of the numbers seen so far. The time complexity is O(N) and space complexity is O(N).",
  solution_2: "```javascript\nfunction findDuplicate(nums) {\n  let slow = nums[0];\n  let fast = nums[nums[0]];\n  \n  while (slow !== fast) {\n    slow = nums[slow];\n    fast = nums[nums[fast]];\n  }\n  \n  fast = 0;\n  while (slow !== fast) {\n    slow = nums[slow];\n    fast = nums[fast];\n  }\n  return slow;\n}\n```\n\nThis optimized approach uses Floyd's Cycle Finding algorithm. The time complexity is O(N) and space complexity is O(1).",
  judge: {
    solution_1_score: 7,
    solution_2_score: 10,
    solution_1_reasoning: "The **Hash Set** solution is very easy to understand and relatively fast. However, it violates the unwritten constraints often paired with this problem, which usually specifies solving it with **O(1) extra space**. Despite being O(N) for time, the memory allocation can be costly.",
    solution_2_reasoning: "The **Floyd's Tortoise and Hare** algorithm is the optimal solution here. It elegantly satisfies both O(N) time complexity and O(1) space complexity by treating the array elements as pointers to the next index. This showcases a deeper understanding of algorithm design without requiring modification of the input array."
  }
};

const INITIAL_MESSAGES = [
  { role: 'user', text: "Can you provide two different solutions to find a duplicated number in an array, and tell me which one is better?" },
  { role: 'assistant', data: MOCK_AI_RESPONSE }
];

export default function App() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text) => {
    // Add user message
    const newMessages = [...messages, { role: 'user', text }];
    setMessages(newMessages);

    // Mock an AI response after a short delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          data: {
            ...MOCK_AI_RESPONSE,
            problem: "Generating new problem based on: " + text
          }
        }
      ]);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans selection:bg-primary-container selection:text-on-surface transition-colors duration-300">
      {/* Header Area */}
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 px-8 py-5">
        <h1 className="font-display font-semibold text-xl tracking-tight text-on-surface">Battle AI Arena</h1>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 pt-8">
        <div className="max-w-4xl mx-auto flex flex-col justify-end">
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}