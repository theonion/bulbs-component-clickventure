angular.module('bulbs.clickventure.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('clickventure-edit-link/clickventure-edit-link.html',
    "<div class=clickventure-link><div class=\"form-control form-group node-text\"><onion-editor ng-model=link.body role=singleline formatting=bold,italic,strike placeholder=Body></onion-editor></div><div class=row><label class=col-xs-4><span>To page:</span><select class=form-control ng-model=link.to_node ng-change=updateInboundLinks(link) ng-options=\"node.id as (node | clickventure_node_name) || node.id for node in nodeData.nodes\"></select></label><label class=col-xs-3><span>Transition:</span><select class=form-control ng-model=link.transition ng-options=\"transition for transition in nodeTransitions\"></select></label><label class=col-xs-3><span>Style:</span><select class=form-control ng-options=\"style.toLowerCase() as style for style in linkStyles\" ng-model=link.link_style></select></label><label class=col-xs-2><span>Float:</span> <input type=checkbox class=form-control ng-model=link.float></label></div><button class=\"btn btn-link\" ng-click=\"deleteLink(node, link)\"><span class=text-danger><span class=\"fa fa-trash-o\"></span> <span>Delete Link</span></span></button></div>"
  );


  $templateCache.put('clickventure-edit-node-list/clickventure-edit-node-list-node/clickventure-edit-node-list-node.html',
    "<div class=clickventure-edit-node-list-node-status ng-class=\"{\n" +
    "      'clickventure-edit-node-list-node-status-start': node.start,\n" +
    "      'clickventure-edit-node-list-node-status-finish': node.finish\n" +
    "    }\"></div><div class=clickventure-edit-node-list-node-title ng-bind-html=\"node | clickventure_node_name\"></div><div class=clickventure-edit-node-list-node-tools><ng-transclude></ng-transclude></div>"
  );


  $templateCache.put('clickventure-edit-node-list/clickventure-edit-node-list.html',
    "<ol><li ng-repeat=\"node in nodeData.nodes\" ng-click=selectNode(node)><clickventure-edit-node-list-node node=node ng-class=\"{'clickventure-edit-node-list-node-active': nodeData.view[node.id].active}\"><input class=clickventure-edit-node-list-node-tools-item type=number min=1 step=1 ng-model=nodeData.view[node.id].order ng-pattern=\"/^[1-9]{1}[0-9]*$/\" ng-keyup=\"$event.which === 13 && reorderNode($index, nodeData.view[node.id].order - 1)\" ng-blur=\"reorderNode($index, nodeData.view[node.id].order - 1)\"> <button class=\"btn btn-link btn-xs clickventure-edit-node-list-node-tools-item\" ng-click=\"reorderNode($index, $index - 1)\" ng-disabled=$first><span class=\"glyphicon glyphicon-chevron-up\"></span></button> <button class=\"btn btn-link btn-xs clickventure-edit-node-list-node-tools-item\" ng-click=\"reorderNode($index, $index + 1)\" ng-disabled=$last><span class=\"glyphicon glyphicon-chevron-down\"></span></button></clickventure-edit-node-list-node></li></ol>"
  );


  $templateCache.put('clickventure-edit-node-toolbar/clickventure-edit-node-toolbar.html',
    "<div class=clickventure-edit-node-toolbar-title>Edit</div><div class=\"clickventure-edit-node-toolbar-view btn-group\"><button class=\"btn btn-default\">Settings</button> <button class=\"btn btn-default\">Copy</button></div><div class=clickventure-edit-node-toolbar-preview><a class=\"btn btn-link text-primary\" target=_blank href=\"/r/{{ article.id }}#{{ activeNode.id }}\"><i class=\"glyphicon glyphicon-share-alt\"></i> <span>Preview Page</span></a></div>"
  );


  $templateCache.put('clickventure-edit-node/clickventure-edit-node.html',
    "<div class=clickventure-node><div class=\"form-control form-group clearfix node-text\"><onion-editor ng-model=node.title role=singleline formatting=bold,italic,strike placeholder=\"Name (used for display in CMS)\"></onion-editor></div><div class=form-group><label class=checkbox-inline><input type=checkbox ng-model=node.start> <span>Start</span></label><label class=checkbox-inline><input type=checkbox ng-model=node.finish> <span>Finish</span></label><label class=checkbox-inline><input type=checkbox ng-model=node.shareable> <span>Shareable</span></label><button class=\"btn btn-danger\" ng-click=deleteNode(node)><i class=\"fa fa-trash-o\"></i> <span>Delete Page</span></button> <button class=\"btn btn-primary\" ng-click=cloneNode(node)><i class=\"fa fa-copy\"></i> <span>Clone Page</span></button></div><div ng-show=node.shareable class=form-group><span>Share Message</span><div class=form-control><onion-editor role=singleline ng-model=node.share_text placeholder=\"Message for sharing\"></onion-editor></div></div><div class=well><onion-editor ng-model=node.body role=multiline placeholder=\"Body (displays on site)\"></onion-editor></div><div class=\"navbar navbar-default\"><label><span>Default link Style</span><select class=form-control ng-options=\"style.toLowerCase() as style for style in linkStyles\" ng-model=node.link_style></select></label></div><div class=panel-group><div><div>Links</div><button class=\"btn btn-success\" ng-click=addLink(node)><span class=\"glyphicon glyphicon-plus\"></span> <span>Add Link</span></button></div><div ng-repeat=\"link in node.links\" class=\"clearfix panel panel-default\"><div class=panel-heading><h4 class=panel-title><span>Link</span><div class=\"btn-group pull-right\"><button class=\"btn btn-link btn-xs\" ng-click=\"reorderLink(node, $index, $index + 1)\" ng-disabled=$last><span class=\"glyphicon glyphicon-chevron-down\"></span></button> <button class=\"btn btn-link btn-xs\" ng-click=\"reorderLink(node, $index, $index - 1)\" ng-disabled=\"$index === 0\"><span class=\"glyphicon glyphicon-chevron-up\"></span></button></div></h4></div><div class=panel-body><clickventure-edit-link node=node link=link></clickventure-edit-link></div></div></div><div class=row><h3>Inbound Links</h3><ul><li ng-repeat=\"nodeId in nodeData.view[node.id].inboundLinks\"><a ng-bind-html=\"nodeData.view[nodeId].node | clickventure_node_name\" ng-click=selectNode(node)></a></li></ul><h3>Sister Pages</h3><ul><li ng-repeat=\"nodeId in node.sister_pages\"><a ng-bind-html=\"nodeData.view[nodeId].node | clickventure_node_name\" ng-click=selectNode(node)></a></li></ul></div></div>"
  );


  $templateCache.put('clickventure-edit.html',
    "<div class=clickventure-edit-col-1><clickventure-edit-node-list></clickventure-edit-node-list><div class=clickventure-edit-node-list-tools><button class=\"btn btn-primary\" ng-click=addNode()><span class=\"glyphicon glyphicon-plus\"></span> <span>New Page</span></button> <button class=\"btn btn-default\" ng-click=validatePages()><span class=\"glyphicon glyphicon-ok\"></span> <span>Run Check</span></button></div></div><div class=clickventure-edit-col-2><clickventure-edit-node-toolbar></clickventure-edit-node-toolbar><clickventure-edit-node nodes=article.nodes node=selectedNode select-node=selectNode(node) clone-node=onCloneNode(node)></clickventure-edit-node></div>"
  );

}]);
