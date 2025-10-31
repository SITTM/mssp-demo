import { render, screen } from '@testing-library/react'
import TrainingDashboard from '@/app/training/dashboard/page'
import '@testing-library/jest-dom'

describe('Training Dashboard', () => {
  it('should render welcome message with user name', () => {
    render(<TrainingDashboard />)
    expect(screen.getByText(/Welcome, Jamie R\./i)).toBeInTheDocument()
  })

  it('should display assigned training tracks section', () => {
    render(<TrainingDashboard />)
    expect(screen.getByText(/Assigned Training Tracks/i)).toBeInTheDocument()
  })

  it('should show Track 1 with progress information', () => {
    render(<TrainingDashboard />)
    expect(screen.getByText(/Track 1: Insider Threat Fundamentals/i)).toBeInTheDocument()
    expect(screen.getByText(/60% complete/i)).toBeInTheDocument()
    expect(screen.getByText(/In Progress/i)).toBeInTheDocument()
  })

  it('should show next module due date', () => {
    render(<TrainingDashboard />)
    expect(screen.getByText(/Module 4: Legal & Privacy/i)).toBeInTheDocument()
    expect(screen.getByText(/due in 3 days/i)).toBeInTheDocument()
  })

  it('should display Continue Training button', () => {
    render(<TrainingDashboard />)
    const continueButton = screen.getByRole('button', { name: /Continue Training/i })
    expect(continueButton).toBeInTheDocument()
  })

  it('should show Track 2 as locked', () => {
    render(<TrainingDashboard />)
    expect(screen.getByText(/Track 2: Program Building Essentials/i)).toBeInTheDocument()
    expect(screen.getByText(/Locked/i)).toBeInTheDocument()
  })

  it('should display certifications section', () => {
    render(<TrainingDashboard />)
    expect(screen.getByText(/Certifications/i)).toBeInTheDocument()
    expect(screen.getByText(/Foundation Certificate/i)).toBeInTheDocument()
    expect(screen.getByText(/ITPB \(Insider Threat Program Builder\)/i)).toBeInTheDocument()
  })

  it('should display recent activity', () => {
    render(<TrainingDashboard />)
    expect(screen.getByText(/Recent Activity/i)).toBeInTheDocument()
    expect(screen.getByText(/Completed Module 3/i)).toBeInTheDocument()
  })
})
