import React, { Component } from 'react';
import '../../css/jquery.dataTables.min.css';

// This is a constant used to reflect jquery in our class
const $ = require('jquery');

// This loads functions related to jquery DataTables.
$.DataTable= require('datatables.net');

export class DataTable extends Component{
    componentDidMount(){
        // Attaches normal html table to jquery datatable
        this.$el= $(this.el);
        this.loadDataTable();
    }

    // This function executes for each action on data table 
    componentDidUpdate(){
         this.loadDataTable();
    }

    //This loads the exact datatable
    loadDataTable = ()=>{
        if($.fn.DataTable.isDataTable( this.$el)){
            //This line clears the previous datatable for every show entries and pagination changes
            this.$el.DataTable().clear().destroy();
        }
        this.$el.DataTable({
            retrieve: true,
            data: this.props.billData, // This is the billData provided to show in data Table
            columns: this.props.columns, // This is list of column names provided to display in data Table
            "deferRender": true,
            "lengthMenu": [ [3, 5, 10, 50, -1], [3, 5, 10, 50, "All"] ], // These are the entry options for show entries to be select in dataTable
            "pageLength": 10, // This is the no of default rows/entries shown in datatable
            "pagingType": "full_numbers", // This shows pagination list
            // These are pagination style settings of datatable
            "oLanguage": {
                "oPaginate": {
                    "sPrevious": "<<  Previous",
                    "sNext" : "Next >>",
                    "sFirst": "First",
                    "sLast": "Last"
                }
            }
        })
    }

    render(){ return <table  className="display" width="100%" ref={el=> this.el=el}> </table> }
}