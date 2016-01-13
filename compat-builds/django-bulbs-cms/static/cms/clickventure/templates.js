angular.module('bulbs.clickventure.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('clickventure-edit-link/clickventure-edit-link.html',
    "<div class=clickventure-link><div ng-show=!link.to_node class=\"alert alert-danger\" role=alert><span class=\"fa fa-exclamation-circle\"></span> <span>This link doesn't link to another page!</span></div><div class=\"form-group form-group\"><label for=\"linkText{{ uuid }}\">Link Content</label><input id=\"linkText{{ uuid }}\" class=form-control ng-model=link.body placeholder=\"Link Content (displays on site)\"></div><div class=row><div class=col-xs-5 ng-class=\"{'has-error': !link.to_node}\"><label class=control-label for=\"linkTo{{ uuid }}\">Link To</label><select id=\"linkTo{{ uuid }}\" class=form-control ng-model=link.to_node ng-change=updateInboundLinks(link) ng-options=\"node.id as (node | clickventure_node_name) || node.id for node in nodeData.nodes\"></select></div><div class=col-xs-4><label for=\"linkStyle{{ uuid }}\">Style</label><select id=\"linkStyle{{ uuid }}\" class=form-control ng-options=\"style.toLowerCase() as style for style in linkStyles\" ng-model=link.link_style></select></div><div class=col-xs-3><button class=\"btn form-button\" ng-class=\"{\n" +
    "            'btn-info': link.float,\n" +
    "            'btn-default': !link.flaot\n" +
    "          }\" ng-click=\"link.float = !link.float\"><span class=fa ng-class=\"{\n" +
    "              'fa-check-square-o': link.float,\n" +
    "              'fa-square-o': !link.float\n" +
    "            }\"></span> <span>Float Link</span></button></div></div><div class=row><div class=col-xs-12><button class=\"btn btn-danger form-button\" ng-click=\"deleteLink(node, link)\"><span class=\"fa fa-trash-o\"></span> <span>Delete Link</span></button></div></div></div>"
  );


  $templateCache.put('clickventure-edit-node-list/clickventure-edit-node-list-node/clickventure-edit-node-list-node.html',
    "<div class=clickventure-edit-node-list-node-status ng-class=\"{\n" +
    "      'clickventure-edit-node-list-node-status-start': node.start,\n" +
    "      'clickventure-edit-node-list-node-status-finish': node.finish\n" +
    "    }\"></div><div class=clickventure-edit-node-list-node-title ng-bind-html=\"node | clickventure_node_name\"></div><div class=clickventure-edit-node-list-node-tools><ng-transclude></ng-transclude></div>"
  );


  $templateCache.put('clickventure-edit-node-list/clickventure-edit-node-list.html',
    "<ol><li ng-repeat=\"node in nodeData.nodes\" ng-click=selectNode(node)><clickventure-edit-node-list-node node=node ng-class=\"{'clickventure-edit-node-list-node-active': nodeData.view[node.id].active}\"><input class=clickventure-edit-node-list-node-tools-item type=number min=1 step=1 ng-model=nodeData.view[node.id].order ng-pattern=\"/^[1-9]{1}[0-9]*$/\" ng-keyup=\"$event.which === 13 && reorderNode($index, nodeData.view[node.id].order - 1)\" ng-blur=\"reorderNode($index, nodeData.view[node.id].order - 1)\"> <button class=\"btn btn-link btn-xs clickventure-edit-node-list-node-tools-item\" ng-click=\"reorderNode($index, $index - 1)\" ng-disabled=$first><span class=\"fa fa-chevron-up\"></span></button> <button class=\"btn btn-link btn-xs clickventure-edit-node-list-node-tools-item\" ng-click=\"reorderNode($index, $index + 1)\" ng-disabled=$last><span class=\"fa fa-chevron-down\"></span></button></clickventure-edit-node-list-node></li></ol>"
  );


  $templateCache.put('clickventure-edit-node-toolbar/clickventure-edit-node-toolbar.html',
    "<div class=clickventure-edit-node-toolbar-title>Edit</div><div class=\"clickventure-edit-node-toolbar-view btn-group\"><button ng-repeat=\"title in data.configPages\" ng-click=changeConfigPage(title) ng-class=\"{\n" +
    "        'btn-default': data.configPageActive !== title,\n" +
    "        'btn-primary': data.configPageActive === title\n" +
    "      }\" class=btn>{{ title }}</button></div><div class=clickventure-edit-node-toolbar-preview><a class=\"btn btn-link text-primary\" target=_blank href=\"/r/{{ article.id }}#{{ selectedNode.id }}\"><i class=\"fa fa-share\"></i> <span>Preview Page</span></a></div>"
  );


  $templateCache.put('clickventure-edit-node/clickventure-edit-node-copy/clickventure-edit-node-copy.html',
    "<div class=container-fluid ng-show=\"data.configPageActive === 'Copy'\"><div class=row><div class=col-xs-12><label>Page Body</label><onion-editor ng-model=node.body role=multiline placeholder=\"Body (displays on site)\"></onion-editor></div></div><div class=row><h4 class=col-xs-12>Links</h4><div class=\"form-group col-xs-4\"><button class=\"btn btn-success\" ng-click=addLink(node)><span class=\"fa fa-plus\"></span> <span>Add Link</span></button></div><div class=\"form-group col-xs-8\"><div class=\"form-inline pull-right\"><label for=nodeDefaultLinkStyle>Default Link Style</label><select id=nodeDefaultLinkStyle class=form-control ng-options=\"style.toLowerCase() as style for style in linkStyles\" ng-model=node.link_style></select></div></div></div><div class=row><ol class=col-xs-12 ng-show=\"node.links.length > 0\"><li ng-repeat=\"link in node.links\" ng-init=\"linkOpen = false\" class=\"clearfix panel panel-default\"><div class=panel-heading ng-click=\"linkOpen = !linkOpen\"><h4 class=panel-title><span class=\"fa fa-caret-right\" ng-class=\"{\n" +
    "                  'fa-caret-right': !linkOpen,\n" +
    "                  'fa-caret-down': linkOpen\n" +
    "                }\"></span> <span>Link</span> <span class=\"fa fa-exclamation-circle text-danger\" ng-show=!link.to_node></span><div class=\"btn-group pull-right\"><button class=\"btn btn-link btn-xs\" ng-click=\"reorderLink(node, $index, $index + 1)\" ng-disabled=$last><span class=\"fa fa-chevron-down\"></span></button> <button class=\"btn btn-link btn-xs\" ng-click=\"reorderLink(node, $index, $index - 1)\" ng-disabled=\"$index === 0\"><span class=\"fa fa-chevron-up\"></span></button></div></h4></div><div class=panel-body ng-show=linkOpen><clickventure-edit-link node=node link=link></clickventure-edit-link></div></li></ol><div class=col-xs-12 ng-show=\"node.links.length === 0\">No outbound links yet, click \"Add Link\" to add the first one.</div></div></div>"
  );


  $templateCache.put('clickventure-edit-node/clickventure-edit-node-settings/clickventure-edit-node-settings.html',
    "<div class=container-fluid ng-show=\"data.configPageActive === 'Settings'\"><div class=\"row form-group\"><div class=col-xs-8><label for=nodePageName>Page Name (Internal Use)</label><input id=nodePageName class=form-control placeholder=\"Page Name (Internal Use)\" ng-model=node.title></div><div class=col-xs-4><button class=\"btn btn-primary form-button\" ng-click=cloneNode(node)><i class=\"fa fa-copy\"></i> <span>Clone Page</span></button></div></div><div class=\"row form-group\"><div class=col-xs-12><label>Select Page Type</label></div><div class=\"clearfix form-group\"><div class=\"btn-group col-xs-4\"><button class=btn ng-class=\"{\n" +
    "              'btn-info': node.start,\n" +
    "              'btn-default': !node.start\n" +
    "            }\" ng-click=\"node.start = !node.start; node.finish = false\"><span class=fa ng-class=\"{\n" +
    "                'fa-check-circle-o': node.start,\n" +
    "                'fa-circle-o': !node.start\n" +
    "              }\"></span> <span>Start</span></button> <button class=btn ng-class=\"{\n" +
    "              'btn-info': node.finish,\n" +
    "              'btn-default': !node.finish\n" +
    "            }\" ng-click=\"node.finish = !node.finish; node.start = false\"><span class=fa ng-class=\"{\n" +
    "                'fa-check-circle-o': node.finish,\n" +
    "                'fa-circle-o': !node.finish\n" +
    "              }\"></span> <span>End</span></button></div><div class=col-xs-4><button class=btn ng-show=node.finish ng-class=\"{\n" +
    "              'btn-info': node.shareable,\n" +
    "              'btn-default': !node.shareable\n" +
    "            }\" ng-click=\"node.shareable = !node.shareable\"><span class=fa ng-class=\"{\n" +
    "                'fa-check-square-o': node.shareable,\n" +
    "                'fa-square-o': !node.shareable\n" +
    "              }\"></span> <span>Shareable</span></button></div></div><div ng-show=\"node.finish && node.shareable\" class=\"col-xs-12 form-group\"><label for=nodeShareText>Share Message</label><input id=nodeShareText class=form-control placeholder=\"Page Name (Internal Use)\" ng-model=node.share_text></div></div><div class=\"row form-group\"><div class=col-xs-6><label>Inbound Links</label><ul ng-show=\"data.view[node.id].inboundLinks.length > 0\"><li ng-repeat=\"nodeId in data.view[node.id].inboundLinks\"><a ng-bind-html=\"data.view[nodeId].node | clickventure_node_name\" ng-click=selectNode(node)></a></li></ul><div ng-show=\"data.view[node.id].inboundLinks.length === 0\">No inbound links yet, link a page to this one to make the first one.</div></div><div class=col-xs-6><label>Sister Pages</label><ul ng-show=\"node.sister_pages.length > 0\"><li ng-repeat=\"nodeId in node.sister_pages\"><a ng-bind-html=\"data.view[nodeId].node | clickventure_node_name\" ng-click=selectNode(node)></a></li></ul><div ng-show=\"node.sister_pages.length === 0\">No sister pages yet, clone this page to make the first one.</div></div></div><div class=\"row col-xs-12 form-group\"><button class=\"btn btn-danger\" ng-click=deleteNode(node)><i class=\"fa fa-trash-o\"></i> <span>Delete Page</span></button></div></div>"
  );


  $templateCache.put('clickventure-edit-node/clickventure-edit-node.html',
    "<clickventure-edit-node-settings node=node default-active=true></clickventure-edit-node-settings><clickventure-edit-node-copy node=node></clickventure-edit-node-copy>"
  );


  $templateCache.put('clickventure-edit.html',
    "<div class=clickventure-edit-col-1><clickventure-edit-node-list></clickventure-edit-node-list><div class=clickventure-edit-node-list-tools><button class=\"btn btn-primary\" ng-click=addNode()><span class=\"fa fa-plus\"></span> <span>New Page</span></button> <button class=\"btn btn-default\" ng-click=validateGraph()><span class=\"fa fa-check\"></span> <span>Run Check</span></button></div></div><div class=clickventure-edit-col-2><clickventure-edit-node-toolbar article=article></clickventure-edit-node-toolbar><clickventure-edit-node node=selectedNode></clickventure-edit-node></div>"
  );

}]);
