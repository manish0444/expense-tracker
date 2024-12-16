'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([])
  const [inputValue, setInputValue] = useState('')

  const toggleChat = () => setIsOpen(!isOpen)

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, isUser: true }])
      setInputValue('')
      // Simulate a response from the support team
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "Thank you for your message. Our support team will get back to you soon.", isUser: false }])
      }, 1000)
    }
  }

  return (
    <>
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 left-4 rounded-full shadow-lg"
      >
        {isOpen ? 'Close Chat' : 'Live Chat'}
      </Button>
      {isOpen && (
        <Card className="fixed bottom-20 left-4 w-80 h-96 flex flex-col">
          <CardHeader>
            <CardTitle>Live Chat Support</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto">
            {messages.map((message, index) => (
              <div key={index} className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                  {message.text}
                </span>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <form onSubmit={sendMessage} className="flex w-full">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-grow mr-2"
              />
              <Button type="submit">Send</Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  )
}

