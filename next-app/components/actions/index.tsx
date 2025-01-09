"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, PlusCircle, RefreshCcw, X } from 'lucide-react'
import { ApiForm } from "./api-form"
import { QnAForm } from "./qna"
import { SlackForm } from "./slack"

interface ActionItem {
  id: string
  title: string
  icon: React.ReactNode
  component: React.ReactNode
}

export default function Actions() {
  const [openDialog, setOpenDialog] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleClose = () => {
    setOpenDialog(null)
  }

  const actionItems: ActionItem[] = [
    {
      id: '1',
      title: 'Add API DOC',
      icon: <PlusCircle className="w-4 h-4 mr-2" />,
      component: <ApiForm isUpdate={false} onClose={handleClose} />
    },
    {
      id: '2',
      title: 'Update API DOC',
      icon: <RefreshCcw className="w-4 h-4 mr-2" />,
      component: <ApiForm isUpdate={true} onClose={handleClose} />
    },
    {
      id: '3',
      title: 'New Q&A',
      icon: <PlusCircle className="w-4 h-4 mr-2" />,
      component: <QnAForm onClose={handleClose} />
    },
    {
      id: '4',
      title: 'Import From Slack',
      icon: <SlackIcon />,
      component: <SlackForm onClose={handleClose} />
    }
  ]

  const ActionButton = ({ item }: { item: ActionItem }) => (
    <Dialog 
      key={item.id}
      open={openDialog === item.id} 
      onOpenChange={(open) => {
        setOpenDialog(open ? item.id : null)
        if (open) setIsMenuOpen(false)
      }}
    >
      <DialogTrigger asChild>
        <Button 
          className="w-full bg-gray-900/50 border border-gray-700/50 text-gray-100 hover:bg-gray-800/50 justify-start"
          variant="ghost"
        >
          {item.icon}
          {item.title}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700  text-gray-100">
        <DialogHeader>
          <DialogTitle>{item.title}</DialogTitle>
        </DialogHeader>
        {item.component}
      </DialogContent>
    </Dialog>
  )

  return (
    <>
      <div className="md:hidden">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="bg-gray-900/50 border border-gray-700/50 text-gray-100 hover:bg-gray-800/50"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="w-64 bg-gray-900 border-gray-700 p-0"
          >
            <div className="flex flex-col p-2 mt-20 gap-4">
              {actionItems.map((item) => (
                <ActionButton key={item.id} item={item} />
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
 
      <div className="hidden md:flex items-center gap-2">
        {actionItems.map((item) => (
          <Dialog 
            key={item.id}
            open={openDialog === item.id} 
            onOpenChange={(open) => setOpenDialog(open ? item.id : null)}
          >
            <DialogTrigger asChild>
              <Button 
                className="bg-gray-900/50 border border-gray-700/50 text-gray-100 hover:bg-gray-800/50 whitespace-nowrap"
              >
                {item.icon}
                {item.title}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 text-gray-100">
              <DialogHeader>
                <DialogTitle>{item.title}</DialogTitle>
              </DialogHeader>
              {item.component}
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </>
  )
}

const SlackIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ height: '16px', width: '16px', marginRight: '8px' }}
      viewBox="0 0 122.8 122.8"
    >
      <path
        d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"
        fill="#e01e5a"
      ></path>
      <path
        d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"
        fill="#36c5f0"
      ></path>
      <path
        d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"
        fill="#2eb67d"
      ></path>
      <path
        d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
        fill="#ecb22e"
      ></path>
    </svg>
  );
};