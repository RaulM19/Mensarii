"use client"

import * as React from 'react'
import { Plus } from 'lucide-react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'

import { useArcas } from '@/contexts/pockets-context'
import { Button } from '@/components/ui/button'
import { ArcaCard } from '@/components/pocket-card'
import { CreateArcaDialog } from '@/components/create-pocket-dialog'

export default function Home() {
  const { arcas } = useArcas()
  const [isCreateDialogOpen, setCreateDialogOpen] = React.useState(false)
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 
              className="text-2xl font-bold text-primary cursor-pointer" 
              onClick={toggleTheme}
            >
              Mensarii
            </h1>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Arca
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {arcas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {arcas.map((arca, index) => (
                <motion.div
                  key={arca.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ArcaCard
                    arca={arca}
                    isFirst={index === 0}
                    isLast={index === arcas.length - 1}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-full min-h-[50vh] bg-card border border-dashed rounded-lg p-8">
            <h2 className="text-xl font-semibold text-foreground">No Arcas Yet</h2>
            <p className="mt-2 text-muted-foreground">Get started by creating your first savings arca.</p>
            <Button onClick={() => setCreateDialogOpen(true)} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Arca
            </Button>
          </div>
        )}
      </main>

      <CreateArcaDialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen} />
    </>
  )
}
