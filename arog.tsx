# Approval Report UI - Reference for Backbone.js Conversion

## Data Structure

```javascript
{
  responseId: "RESP-001",
  taskType: "Compliance Audit",
  surveyName: "Q4 2024 Security Assessment",
  controls: "ISO 27001",
  respondedBy: "John Smith",
  approver: "Sarah Johnson",
  status: "Pending", // or "Approved" or "Clarification Requested"
  questionnaire: "Information Security Questionnaire",
  sections: [
    {
      id: "SEC-001",
      name: "Access Control",
      questions: [
        {
          id: "Q-001",
          question: "Are access controls regularly reviewed?",
          response: "Yes, we conduct quarterly reviews of all access permissions.",
          responseComments: "Last review completed on Oct 15, 2024",
          certifiedYesNo: true,
          certifiedBy: "John Smith",
          approverComments: ""
        }
      ]
    }
  ]
}
```

## UI Requirements

### Table Columns (17 total):
1. Expand/Collapse icon
2. Checkbox (for selection)
3. Response ID
4. Task Type
5. Survey Name
6. Controls
7. Responded By
8. Approver
9. Status (badge)
10. Questionnaire
11. Section
12. Question
13. Response
14. Response Comments
15. Certified Yes/No (badge)
16. Certified By
17. Approver Comments

### Functionality:

**Hierarchical Display:**
- Response ID rows (expandable) - shows all response-level data
- When expanded → Section rows (expandable) - shows section name
- When section expanded → Question rows - shows all question-level data

**Selection:**
- Individual checkboxes for each question
- Checkbox at response ID level selects all questions in that response
- Show indeterminate state when partially selected
- Display count of selected items

**Actions:**
- "Approve" button (green) - only enabled when items selected
- "Request Clarification" button - only enabled when items selected
- Both open a modal dialog for adding comments
- After confirmation, clear selections

**Visual Design:**
- Response ID rows: light gray background (bg-slate-50)
- Section rows: light blue background (bg-blue-50)
- Question rows: white background
- Indentation: response (normal), section (pl-8), question (pl-12)
- Status badges with color coding
- Horizontal scroll for wide table

## Key User Interactions:

1. Click row to expand/collapse (chevron icon changes)
2. Click checkbox to select (stops propagation, doesn't trigger expand)
3. Select items across multiple responses
4. Click "Approve" or "Request Clarification"
5. Add optional comments in modal
6. Confirm action
7. Selections clear, action logged

## Prompt to Use with ChatGPT:

"I need you to create a Backbone.js application for an approval report based on the above specifications. Please provide:

1. Backbone Models for Question, Section, and ResponseData
2. Backbone Collections for managing these models
3. Backbone Views for:
   - QuestionRowView (individual question row)
   - SectionRowView (section with nested questions)
   - ResponseRowView (response with nested sections)
   - ApprovalReportView (main container view)
   - ModalDialogView (for approve/clarification confirmation)
4. Underscore templates for rendering
5. Event handlers for expand/collapse, checkbox selection, and button actions
6. CSS styles (can use Tailwind classes or custom CSS)
7. Sample initialization code

The application should maintain the same hierarchical structure, selection logic, and approval workflow as described above."
```

---

**Quick Copy Version:**

You can simply copy the ApprovalReport.tsx file content from my previous response and use this prompt:

"Convert this React approval report component to Backbone.js. The component displays a hierarchical table (Response ID → Sections → Questions) with expandable rows, checkboxes for selection, and approve/clarification buttons. Please provide complete Backbone models, collections, views, and templates maintaining the same functionality and visual design."
