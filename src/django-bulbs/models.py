from django.db import models
from jsonfield import JSONField


class ClickventureMixin(models.Model):
    """Mixin to use for clickventure (choose your own adventure) content types."""

    # nodes = {
    #     {
    #         id: integer,
    #         title: reference name,
    #         body: html content,
    #         link_style: default style for links,
    #         links: [
    #             {
    #                 body: the text,
    #                 to_node: id of target node,
    #                 transition: name of transition
    #             },
    #             ...
    #         ]
    #     },
    #     ...
    # }
    nodes = JSONField(default="[]", blank=True)

    class Meta:
        abstract = True

    def to_dict(self):
        doc = super(ClickventureMixin, self).to_dict()
        del doc["nodes"]
        return doc

    def extract_document(self):
        doc = super(ClickventureMixin, self).extract_document()
        node_text = [""]  # leading line break
        for node in self.nodes:
            node_text.append(node["title"])
            node_text.append(node["body"])
            for link in node["links"]:
                node_text.append(link["body"])
        doc["body"] += "\n".join(node_text)
        return doc

    def get_template(self):
        return "clickventure/clickventure_detail.html"
