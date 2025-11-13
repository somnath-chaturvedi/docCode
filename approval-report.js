// ----- Models -----
const ArQuestion = Backbone.Model.extend({});
const ArSection = Backbone.Model.extend({ defaults: { expanded: false, questions: [] } });
const ArResponse = Backbone.Model.extend({ defaults: { expanded: false, sections: [] } });
const ArResponses = Backbone.Collection.extend({ model: ArResponse });

// ----- Views -----
const ArQuestionView = Backbone.View.extend({
  tagName: 'tr',
  className: 'ar-question-row',
  template: _.template(`
    <td></td><td><input type="checkbox" class="ar-select-question" <% if(selected) { %>checked<% } %> /></td>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
    <td></td>
    <td><%- question %></td><td><%- response %></td>
    <td><%- responseComments %></td>
    <td><%- certifiedYesNo ? 'Yes' : 'No' %></td>
    <td><%- certifiedBy %></td>
    <td><%- approverComments || '-' %></td>
  `),
  events: { 'change .ar-select-question': 'toggleSelect' },
  toggleSelect(e) {
    this.model.set('selected', e.target.checked);
    this.trigger('ar:select:change');
  },
  render() { this.$el.html(this.template(this.model.toJSON())); return this; }
});

const ArSectionView = Backbone.View.extend({
  tagName: 'tbody',
  initialize(options) {
    this.section = options.section;
    this.questions = new Backbone.Collection(this.section.get('questions'));
  },
  template: _.template(`
    <tr class="ar-section-row">
      <td class="ar-toggle-section">▶</td>
      <td></td><td colspan="8"></td>
      <td><%- name %></td>
      <td colspan="6" class="ar-text-muted"><%- questions.length %> question(s)</td>
    </tr>
  `),
  events: { 'click .ar-toggle-section': 'toggle' },
  toggle() {
    this.section.set('expanded', !this.section.get('expanded'));
    this.render();
  },
  render() {
    this.$el.html(this.template(this.section.toJSON()));
    if (this.section.get('expanded')) {
      this.questions.each(q => {
        const v = new ArQuestionView({ model: q });
        this.listenTo(v, 'ar:select:change', () => this.trigger('ar:select:change'));
        this.$el.append(v.render().el);
      });
    }
    return this;
  }
});

const ArResponseView = Backbone.View.extend({
  tagName: 'tbody',
  initialize(options) {
    this.response = options.response;
    this.sections = new Backbone.Collection(this.response.get('sections'));
  },
  template: _.template(`
    <tr class="ar-response-row">
      <td class="ar-toggle-response">▶</td>
      <td><input type="checkbox" class="ar-select-response"></td>
      <td><%- responseId %></td><td><%- taskType %></td>
      <td><%- surveyName %></td><td><%- controls %></td>
      <td><%- respondedBy %></td><td><%- approver %></td>
      <td><%- status %></td><td><%- questionnaire %></td>
      <td colspan="7" class="ar-text-muted"><%- sections.length %> section(s)</td>
    </tr>
  `),
  events: {
    'click .ar-toggle-response': 'toggle',
    'change .ar-select-response': 'selectAll'
  },
  toggle() {
    this.response.set('expanded', !this.response.get('expanded'));
    this.render();
  },
  selectAll(e) {
    const checked = e.target.checked;
    this.sections.each(s => s.get('questions').forEach(q => q.selected = checked));
    this.trigger('ar:select:change');
  },
  render() {
    this.$el.html(this.template(this.response.toJSON()));
    if (this.response.get('expanded')) {
      this.sections.each(s => {
        const view = new ArSectionView({ section: s });
        this.listenTo(view, 'ar:select:change', () => this.trigger('ar:select:change'));
        this.$el.append(view.render().el);
      });
    }
    return this;
  }
});

const ArAppView = Backbone.View.extend({
  el: '#approvalReportApp',
  initialize() {
    this.collection = new ArResponses(window.ArMockData);
    this.body = this.$('#ar-report-body');
    this.countEl = this.$('#ar-selected-count');
    this.approveBtn = this.$('#ar-approve-btn');
    this.clarifyBtn = this.$('#ar-clarify-btn');
    this.dialog = this.$('#ar-dialog');
    this.comments = this.$('#ar-dialog-comments');
    this.render();
  },
  events: {
    'click #ar-approve-btn': 'openApprove',
    'click #ar-clarify-btn': 'openClarify',
    'click #ar-cancel-dialog': 'closeDialog',
    'click #ar-confirm-dialog': 'confirmDialog'
  },
  openApprove() { this.dialogType = 'approve'; this.showDialog(); },
  openClarify() { this.dialogType = 'clarify'; this.showDialog(); },
  showDialog() {
    const count = this.getSelectedCount();
    this.dialog.removeClass('ar-hidden');
    this.$('#ar-dialog-title').text(this.dialogType === 'approve' ? 'Approve Items' : 'Request Clarification');
    this.$('#ar-dialog-desc').text(`You selected ${count} item(s).`);
  },
  closeDialog() { this.dialog.addClass('ar-hidden'); this.comments.val(''); },
  confirmDialog() {
    alert(`${this.dialogType} confirmed for ${this.getSelectedCount()} items.`);
    this.closeDialog();
  },
  getSelectedCount() {
    let count = 0;
    this.collection.each(r => {
      r.get('sections').forEach(s => {
        s.get('questions').forEach(q => { if (q.selected) count++; });
      });
    });
    return count;
  },
  render() {
    this.body.empty();
    this.collection.each(resp => {
      const v = new ArResponseView({ response: resp });
      this.listenTo(v, 'ar:select:change', this.updateSelected.bind(this));
      this.body.append(v.render().el);
    });
    this.updateSelected();
  },
  updateSelected() {
    const count = this.getSelectedCount();
    this.countEl.text(`${count} item(s) selected`);
    this.approveBtn.prop('disabled', count === 0);
    this.clarifyBtn.prop('disabled', count === 0);
  }
});

// ----- Mock Data -----
window.ArMockData = [ /* insert your mockData array here */ ];

// ----- Init -----
$(function(){ new ArAppView(); });
