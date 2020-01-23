/*
 * This file contains display and update functions for the editor.
 */
'use strict';

const BLANKEDITHTML = `<b class="option-item">X:</b>
<input type="number" id="node-x" class="option-item" placeholder="X" value="" min="0" max="600" oninput="changeNodeX(this.value)" onchange="changeNodeX(this.value)">
<br>
<br>
<b class="option-item">Y:</b>
<input type="number" id="node-y" class="option-item" placeholder="Y" value="" min="0" max="600" oninput="changeNodeY(this.value)" onchange="changeNodeY(this.value)">
<br>
<br>
<b class="option-item">Speed to next node:</b>
<input type="number" id="node-speed" class="option-item" placeholder="Speed" value="" min="-1.0" max="1.0" step=".05" oninput="changeNodeSpeed(this.value)" onchange="changeNodeSpeed(this.value)">
<br>
<br>
<input type="checkbox" id="node-has-action" onclick="updateAction()" class="option-item" value="">Has action</input>
<br>
<br>
<b id="action-text" class="option-item">Action:</b>
<input type="text" id="node-action" class="option-item" placeholder="Action" value="">`;
const RESETHTML = '<p>No node selected</p>';

var editNode, nodeX, nodeY, nodeSpeed, nodeHasAction, actionText, nodeAction, node;

//Display editor
function displayEditor(){
  editNode = $('#edit-node');
  editNode.html(BLANKEDITHTML);
  nodeX = $('#node-x');
  nodeY = $('#node-y');
  nodeSpeed = $('#node-speed');
  nodeHasAction = $('#node-has-action');
  actionText = $('#action-text');
  nodeAction = $('#node-action');
}

//Hide the editor
function clearEditMode(){
  editNode.html(RESETHTML);
  node = void(0);
}

//Load node in the editor
function loadNode(n){
  node = n;
  nodeX.val(node.x);
  nodeY.val(node.y);
  nodeSpeed.val(node.speedToNextNode);
  if (node.hasAction){
    nodeHasAction.prop('checked', true);
    nodeAction.val(node.action);
    actionText.css('display', 'shown');
    nodeAction.css('display', 'shown');
  }else{
    nodeHasAction.prop('checked', false);
    nodeAction.val('');
    actionText.css('display', 'none');
    nodeAction.css('display', 'none');
  }
}

//Update only coordinates on mouse move
function updateCoordsOnly(){
  nodeX.val(node.x);
  nodeY.val(node.y);
}

//Change input values
function changeNodeX(val){
  if (val < 0){
    nodeX.val(0);
    val = 0;
  }
  if (val > 600){
    nodeX.val(600);
    val = 600;
  }
  node.x = val;
}
function changeNodeY(val){
  if (val < 0){
    nodeY.val(0);
    val = 0;
  }
  if (val > 600){
    nodeY.val(600);
    val = 600;
  }
  node.y = val;
}
function changeNodeSpeed(val){
  if (val < -1){
    nodeSpeed.val(-1);
    val = -1;
  }
  if (val > 1){
    nodeSpeed.val(1);
    val = 1;
  }
  node.speedToNextNode = val;
}

//Action detection
function updateAction(){
  if (nodeHasAction.prop('checked')){
    let n = node;
    let i = nodes.indexOf(n);
    nodes[i] = new ActionNode(n.ctx, n.x, n.y, '');
    nodes[i].speedToNextNode = nodeSpeed.val();
    nodeAction.val('');
    actionText.css('display', 'shown');
    nodeAction.css('display', 'shown');
  }else{
    let n = node;
    let i = nodes.indexOf(n);
    nodes[i] = new Node(n.ctx, n.x, n.y);
    nodes[i].speedToNextNode = nodeSpeed.val();
    nodeAction.val('');
    actionText.css('display', 'none');
    nodeAction.css('display', 'none');
  }
  calcOrder();
};
