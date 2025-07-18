# Workflow Builder

## Overview

A React-based visual workflow builder application that allows users to create workflows with different types of nodes through a drag-and-drop interface.

## Features

- **Node Types**: Start, Form, Conditional, API, and End blocks
- **Visual Canvas**: ReactFlow-powered workflow canvas with drag-and-drop support
- **Block Panel**: Left sidebar with draggable workflow blocks
- **Modern UI**: Built with @radix-ui/themes design system
- **TypeScript**: Full TypeScript support throughout the application

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd workflow-challenge-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Tech Stack

- **React 18** with TypeScript
- **@radix-ui/themes** for UI components
- **ReactFlow** for workflow canvas
- **React Hook Form** for form management
- **Vite** for build tooling

## Project Structure

```
src/
├── components/
│   ├── WorkflowEditor.tsx    # Main workflow canvas
│   ├── BlockPanel.tsx        # Left panel with draggable blocks
│   └── nodes/               # Node components
│       ├── StartNode.tsx
│       ├── FormNode.tsx
│       ├── ConditionalNode.tsx
│       ├── ApiNode.tsx
│       └── EndNode.tsx
├── pages/
│   ├── Index.tsx
│   └── NotFound.tsx
└── main.tsx
```
