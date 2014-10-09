
// SORT tables based on an invisible span containing the value
$.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
{
    return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
        return $('span[dfx-sorting-column]', td).text();
    } );
};
