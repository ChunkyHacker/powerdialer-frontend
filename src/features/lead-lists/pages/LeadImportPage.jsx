import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router'
import Button from '../../../components/ui/Button.jsx'

function LeadImportPage() {
  const navigate = useNavigate()

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h1 className="text-role-page-title">Import Leads</h1>
        <p className="mt-1 max-w-2xl text-role-body-copy text-text-secondary">
          The detailed lead import workflow will be implemented in the
          next Lead Import subtask.
        </p>
      </div>

      <Button
        variant="outline"
        size="md"
        icon={ArrowLeft}
        onClick={() => navigate('/lead-lists')}
      >
        Return to Lead Lists
      </Button>
    </div>
  )
}

export default LeadImportPage
