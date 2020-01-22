/*
 * This file contains display and update functions for the editor.
 */

const BLANKEDITHTML = `<b class="option-item">X:</b>
<input type="text" id="node-x" class="option-item" placeholder="X" value="">
<br>
<br>
<b class="option-item">Y:</b>
<input type="text" id="node-y" class="option-item" placeholder="Y" value="">
<br>
<br>
<input type="checkbox" id="node-has-action" class="option-item" value="">Has action</input>
<br>
<br>
<b class="option-item">Action:</b>
<input type="text" id="node-action" class="option-item" placeholder="Action" value="">`;

var editNode = $('#edit-node');
var nodeX, nodeY, nodeHasAction, nodeAction;

//Display editor
function displayEditor(){
  editNode.html(BLANKEDITHTML);
  nodeX = $('#node-x');
  nodeY = $('#node-y');
  nodeHasAction = $('#node-has-action');
  nodeAction = $('#node-action');
}

//Load node in the editor
function loadNode(node){
  nodeX.val(node.x);
  nodeY.val(node.y);
  if (node.hasAction){
    nodeHasAction.prop('checked', true);
    nodeAction.val(node.action);
    nodeAction.css('display', 'shown')
  }else{
    nodeHasAction.prop('checked', false);
    nodeAction.val('');
    nodeAction.css('display', 'none');
  }
}
