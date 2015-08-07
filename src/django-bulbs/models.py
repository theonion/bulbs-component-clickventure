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
