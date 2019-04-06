/*! KeyTable 2.1.3
* ©2009-2016 SpryMedia Ltd - datatables.net/license
*/(function(factory){if(typeof define==='function'&&define.amd){define(['jquery','datatables.net'],function($){return factory($,window,document);});}
else if(typeof exports==='object'){module.exports=function(root,$){if(!root){root=window;}
if(!$||!$.fn.dataTable){$=require('datatables.net')(root,$).$;}
return factory($,root,root.document);};}
else{factory(jQuery,window,document);}}(function($,window,document,undefined){'use strict';var DataTable=$.fn.dataTable;var KeyTable=function(dt,opts){if(!DataTable.versionCheck||!DataTable.versionCheck('1.10.8')){throw 'KeyTable requires DataTables 1.10.8 or newer';}
this.c=$.extend(true,{},DataTable.defaults.keyTable,KeyTable.defaults,opts);this.s={dt:new DataTable.Api(dt),enable:true,focusDraw:false};this.dom={};var settings=this.s.dt.settings()[0];var exisiting=settings.keytable;if(exisiting){return exisiting;}
settings.keytable=this;this._constructor();};$.extend(KeyTable.prototype,{blur:function()
{this._blur();},enable:function(state)
{this.s.enable=state;},focus:function(row,column)
{this._focus(this.s.dt.cell(row,column));},focused:function(cell)
{var lastFocus=this.s.lastFocus;if(!lastFocus){return false;}
var lastIdx=this.s.lastFocus.index();return cell.row===lastIdx.row&&cell.column===lastIdx.column;},_constructor:function()
{this._tabInput();var that=this;var dt=this.s.dt;var table=$(dt.table().node());if(table.css('position')==='static'){table.css('position','relative');}
$(dt.table().body()).on('click.keyTable','th, td',function(e){if(that.s.enable===false){return;}
var cell=dt.cell(this);if(!cell.any()){return;}
that._focus(cell,null,false,e);});$(document).on('keydown.keyTable',function(e){that._key(e);});if(this.c.blurable){$(document).on('click.keyTable',function(e){if($(e.target).parents('.dataTables_filter').length){that._blur();}
if($(e.target).parents().filter(dt.table().container()).length){return;}
if($(e.target).parents('div.DTE').length){return;}
if($(e.target).parents().filter('.DTFC_Cloned').length){return;}
that._blur();});}
if(this.c.editor){dt.on('key.keyTable',function(e,dt,key,cell,orig){that._editor(key,orig);});}
if(dt.settings()[0].oFeatures.bStateSave){dt.on('stateSaveParams.keyTable',function(e,s,d){d.keyTable=that.s.lastFocus?that.s.lastFocus.index():null;});}
dt.on('xhr.keyTable',function(e){if(that.s.focusDraw){return;}
var lastFocus=that.s.lastFocus;if(lastFocus){that.s.lastFocus=null;dt.one('draw',function(){that._focus(lastFocus);});}});dt.on('destroy.keyTable',function(){dt.off('.keyTable');$(dt.table().body()).off('click.keyTable','th, td');$(document.body).off('keydown.keyTable').off('click.keyTable');});var state=dt.state.loaded();if(state&&state.keyTable){dt.one('init',function(){var cell=dt.cell(state.keyTable);if(cell.any()){cell.focus();}});}
else if(this.c.focus){dt.cell(this.c.focus).focus();}},_blur:function()
{if(!this.s.enable||!this.s.lastFocus){return;}
var cell=this.s.lastFocus;$(cell.node()).removeClass(this.c.className);this.s.lastFocus=null;this._updateFixedColumns(cell.index().column);this._emitEvent('key-blur',[this.s.dt,cell]);},_columns:function()
{var dt=this.s.dt;var user=dt.columns(this.c.columns).indexes();var out=[];dt.columns(':visible').every(function(i){if(user.indexOf(i)!==-1){out.push(i);}});return out;},_editor:function(key,orig)
{var dt=this.s.dt;var editor=this.c.editor;orig.stopPropagation();if(key===13){orig.preventDefault();}
editor.inline(this.s.lastFocus.index());$('div.DTE input, div.DTE textarea').select();dt.keys.enable(this.c.editorKeys);dt.one('key-blur.editor',function(){if(editor.displayed()){editor.submit();}});editor.one('close',function(){dt.keys.enable(true);dt.off('key-blur.editor');});},_emitEvent:function(name,args)
{this.s.dt.iterator('table',function(ctx,i){$(ctx.nTable).triggerHandler(name,args);});},_focus:function(row,column,shift,originalEvent)
{var that=this;var dt=this.s.dt;var pageInfo=dt.page.info();var lastFocus=this.s.lastFocus;if(!originalEvent)
originalEvent=null;if(!this.s.enable){return;}
if(typeof row!=='number'){var index=row.index();column=index.column;row=dt.rows({filter:'applied',order:'applied'}).indexes().indexOf(index.row);if(pageInfo.serverSide){row+=pageInfo.start;}}
if(pageInfo.length!==-1&&(row<pageInfo.start||row>=pageInfo.start+pageInfo.length)){this.s.focusDraw=true;dt.one('draw',function(){that.s.focusDraw=false;that._focus(row,column);}).page(Math.floor(row/pageInfo.length)).draw(false);return;}
if($.inArray(column,this._columns())===-1){return;}
if(pageInfo.serverSide){row-=pageInfo.start;}
var cell=dt.cell(':eq('+row+')',column,{search:'applied'});if(lastFocus){if(lastFocus.node()===cell.node()){return;}
this._blur();}
var node=$(cell.node());node.addClass(this.c.className);this._updateFixedColumns(column);if(shift===undefined||shift===true){this._scroll($(window),$(document.body),node,'offset');var bodyParent=dt.table().body().parentNode;if(bodyParent!==dt.table().header().parentNode){var parent=$(bodyParent.parentNode);this._scroll(parent,parent,node,'position');}}
this.s.lastFocus=cell;this._emitEvent('key-focus',[this.s.dt,cell,originalEvent||null]);dt.state.save();},_key:function(e)
{var enable=this.s.enable;var navEnable=enable===true||enable==='navigation-only';if(!enable){return;}
if(e.keyCode===0||e.ctrlKey||e.metaKey||e.altKey){return;}
var cell=this.s.lastFocus;if(!cell){return;}
var that=this;var dt=this.s.dt;if(this.c.keys&&$.inArray(e.keyCode,this.c.keys)===-1){return;}
switch(e.keyCode){case 9:this._shift(e,e.shiftKey?'left':'right',true);break;case 27:if(this.s.blurable&&enable===true){this._blur();}
break;case 33:case 34:if(navEnable){e.preventDefault();var index=dt.cells({page:'current'}).nodes().indexOf(cell.node());dt.one('draw',function(){var nodes=dt.cells({page:'current'}).nodes();that._focus(dt.cell(index<nodes.length?nodes[index]:nodes[nodes.length-1]),null,true,e);}).page(e.keyCode===33?'previous':'next').draw(false);}
break;case 35:case 36:if(navEnable){e.preventDefault();var indexes=dt.cells({page:'current'}).indexes();this._focus(dt.cell(indexes[e.keyCode===35?indexes.length-1:0]),null,true,e);}
break;case 37:if(navEnable){this._shift(e,'left');}
break;case 38:if(navEnable){this._shift(e,'up');}
break;case 39:if(navEnable){this._shift(e,'right');}
break;case 40:if(navEnable){this._shift(e,'down');}
break;default:if(enable===true){this._emitEvent('key',[dt,e.keyCode,this.s.lastFocus,e]);}
break;}},_scroll:function(container,scroller,cell,posOff)
{var offset=cell[posOff]();var height=cell.outerHeight();var width=cell.outerWidth();var scrollTop=scroller.scrollTop();var scrollLeft=scroller.scrollLeft();var containerHeight=container.height();var containerWidth=container.width();if(offset.top<scrollTop){scroller.scrollTop(offset.top);}
if(offset.left<scrollLeft){scroller.scrollLeft(offset.left);}
if(offset.top+height>scrollTop+containerHeight&&height<containerHeight){scroller.scrollTop(offset.top+height-containerHeight);}
if(offset.left+width>scrollLeft+containerWidth&&width<containerWidth){scroller.scrollLeft(offset.left+width-containerWidth);}},_shift:function(e,direction,keyBlurable)
{var that=this;var dt=this.s.dt;var pageInfo=dt.page.info();var rows=pageInfo.recordsDisplay;var currentCell=this.s.lastFocus;var columns=this._columns();if(!currentCell){return;}
var currRow=dt.rows({filter:'applied',order:'applied'}).indexes().indexOf(currentCell.index().row);if(pageInfo.serverSide){currRow+=pageInfo.start;}
var currCol=dt.columns(columns).indexes().indexOf(currentCell.index().column);var
row=currRow,column=columns[currCol];if(direction==='right'){if(currCol>=columns.length-1){row++;column=columns[0];}
else{column=columns[currCol+1];}}
else if(direction==='left'){if(currCol===0){row--;column=columns[columns.length-1];}
else{column=columns[currCol-1];}}
else if(direction==='up'){row--;}
else if(direction==='down'){row++;}
if(row>=0&&row<rows&&$.inArray(column,columns)!==-1){e.preventDefault();this._focus(row,column,true,e);}
else if(!keyBlurable||!this.c.blurable){e.preventDefault();}
else{this._blur();}},_tabInput:function()
{var that=this;var dt=this.s.dt;var tabIndex=this.c.tabIndex!==null?this.c.tabIndex:dt.settings()[0].iTabIndex;if(tabIndex==-1){return;}
var div=$('<div><input type="text" tabindex="'+tabIndex+'"/></div>').css({position:'absolute',height:1,width:0,overflow:'hidden'}).insertBefore(dt.table().node());div.children().on('focus',function(e){that._focus(dt.cell(':eq(0)','0:visible',{page:'current'}),null,true,e);});},_updateFixedColumns:function(column){var dt=this.s.dt;var settings=dt.settings()[0];if(settings._oFixedColumns){var leftCols=settings._oFixedColumns.s.iLeftColumns;var rightCols=settings.aoColumns.length-settings._oFixedColumns.s.iRightColumns;if(column<leftCols||column>rightCols)
dt.fixedColumns().update();}}});KeyTable.defaults={blurable:true,className:'focus',columns:'',editor:null,editorKeys:'navigation-only',focus:null,keys:null,tabIndex:null};KeyTable.version="2.1.3";$.fn.dataTable.KeyTable=KeyTable;$.fn.DataTable.KeyTable=KeyTable;DataTable.Api.register('cell.blur()',function(){return this.iterator('table',function(ctx){if(ctx.keytable){ctx.keytable.blur();}});});DataTable.Api.register('cell().focus()',function(){return this.iterator('cell',function(ctx,row,column){if(ctx.keytable){ctx.keytable.focus(row,column);}});});DataTable.Api.register('keys.disable()',function(){return this.iterator('table',function(ctx){if(ctx.keytable){ctx.keytable.enable(false);}});});DataTable.Api.register('keys.enable()',function(opts){return this.iterator('table',function(ctx){if(ctx.keytable){ctx.keytable.enable(opts===undefined?true:opts);}});});DataTable.ext.selector.cell.push(function(settings,opts,cells){var focused=opts.focused;var kt=settings.keytable;var out=[];if(!kt||focused===undefined){return cells;}
for(var i=0,ien=cells.length;i<ien;i++){if((focused===true&&kt.focused(cells[i]))||(focused===false&&!kt.focused(cells[i]))){out.push(cells[i]);}}
return out;});$(document).on('preInit.dt.dtk',function(e,settings,json){if(e.namespace!=='dt'){return;}
var init=settings.oInit.keys;var defaults=DataTable.defaults.keys;if(init||defaults){var opts=$.extend({},defaults,init);if(init!==false){new KeyTable(settings,opts);}}});return KeyTable;}));