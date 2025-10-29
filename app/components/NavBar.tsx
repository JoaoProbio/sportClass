'use client'

import React, { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

interface NavBarProps {
  tabs: { id: string; label: string; icon?: React.ReactNode; color?: string }[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export const NavBar: React.FC<NavBarProps> = ({ tabs, activeTab, onTabChange }) => {
  const fired = useRef(false)
  const [currentLink, setCurrentLink] = useState<{
    index: number
    left: undefined | number
    width: undefined | number
  }>({
    index: tabs.findIndex(tab => tab.id === activeTab),
    left: undefined,
    width: undefined
  })

  const defaultSelectedTabStyles = [
    '[&:nth-child(1)]:bg-primary-400/20',
    '[&:nth-child(2)]:bg-primary-400/20',
    '[&:nth-child(3)]:bg-primary-400/20',
    '[&:nth-child(4)]:bg-primary-400/20',
    '[&:nth-child(5)]:bg-primary-400/20'
  ]

  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab)
    const updatePosition = () => {
      setCurrentLink(() => ({
        left: document.getElementById('nav-btn-' + activeIndex)?.offsetLeft,
        width: document.getElementById('nav-btn-' + activeIndex)?.getBoundingClientRect().width,
        index: activeIndex
      }))
    }
    
    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [activeTab, tabs])

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="relative flex gap-1 py-1 px-0 md:px-6 min-w-max">
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            id={'nav-btn-' + i}
            onClick={() => {
              fired.current = true
              setCurrentLink(() => ({
                left: document.getElementById('nav-btn-' + i)?.offsetLeft,
                width: document.getElementById('nav-btn-' + i)?.getBoundingClientRect().width,
                index: i
              }))
              onTabChange(tab.id)
            }}
            className={twMerge(
              'flex md:flex-row flex-col flex-1 md:flex-0 items-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-0 md:mt-2 text-sm font-normal duration-75 whitespace-nowrap cursor-pointer rounded-sm transition-[opacity,background-color,transform] hover:opacity-80 active:scale-90 active:transition-[opacity,background-color,transform] active:duration-50 [&:not(:active)]:transition-[opacity,background-color,transform] [&:not(:active)]:duration-[83ms,83ms,167ms] outline-none outline-offset-0 outline-0 outline-[#00000000]',
              currentLink.index === i ? 'text-primary-800' : 'text-text-secondary hover:text-text-primary hover:bg-background-card',
              fired.current ? '' : defaultSelectedTabStyles[currentLink.index]
            )}
          >
            <span className={`py-2 flex items-center justify-center ${tab.color}`}>
              {tab.icon}
            </span>
            <span className="sm:inline">{tab.label}</span>
          </button>
        ))}
        <div className="absolute inset-0 h-full -z-[1] pointer-events-none">
          <div className="relative h-full w-full">
            <div
              style={{
                left: `${currentLink.left || 0}px`,
                width: `${currentLink.width || 0}px`
              }}
              className={twMerge(
                'transition-[left,width] duration-300 absolute top-0 h-full rounded-sm -z-[1]',
                fired.current ? 'bg-primary-400/20' : 'bg-transparent'
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
