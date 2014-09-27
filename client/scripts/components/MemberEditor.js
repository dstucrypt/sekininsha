/** @jsx React.DOM */
'use strict';
var React = require('react/addons');
var MemberEditor = React.createClass({
  updateName: function(event) {
      this.props.group.refine('name').onChange(event.target.value);
  },
  updateTaxID: function(event) {
      this.props.group.refine('tax_id').onChange(event.target.value);
  },
  render: function() {
    if (this.props.group === null) {return null;}
    else
    return (
      <div className="row form-inline">
        <div className="col-md-6">
          <div className="form-group">
            <input type="text" className="form-control" value={this.props.group.refine('name').value} onChange={this.updateName}></input>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <input type="text" className="form-control" value={this.props.group.refine('tax_id').value} onChange={this.updateTaxID}></input>
          </div>
        </div>

      </div>
      )
  }
});
module.exports = MemberEditor;