import { useState } from 'react';
import { ChatArea } from './ChatArea';
import { MessageInput } from './MessageInput';

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

export function Chat() {
  const [messages, setMessages] = useState([]);

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
    <>
      <ChatArea messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </>
  );
}
