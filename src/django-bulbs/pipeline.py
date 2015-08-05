
class PipelineWrapper(object):

    def __init__(self):
        self.name = ""
        self.dict = {
            "source_filenames": (),
            "output_filename": ""
        }

    def set_name(self, name):
        self.name = name
        return self

    def add_source_filename(self, filename):
        self.dict["source_filenames"] += (filename,)
        return self

    def set_output_filename(self, filename):
        self.dict["output_filename"] = filename
        return self

    def update_pipeline(self, pipeline_config):
        pipeline_config.update({self.name: self.dict})
        return self

cms_css = PipelineWrapper()
cms_css \
    .set_name("clickventure_cms") \
    .set_output_filename("css/clickventure-cms.css") \
    .add_source_filename("cms/clickventure/*.less")

public_css = PipelineWrapper()
public_css \
    .set_name("clickventure") \
    .set_output_filename("css/clickventure.css") \
    .add_source_filename("clickventure/styles/clickventure.less")

cms_js = PipelineWrapper()
cms_js \
    .set_name("clickventure_cms") \
    .set_output_filename("js/clickventure-cms.js") \
    .add_source_filename("cms/clickventure/*.js")

public_js = PipelineWrapper()
public_js \
    .set_name("clickventure") \
    .set_output_filename("js/clickventure.js") \
    .add_source_filename("velocity/jquery.velocity.min.js") \
    .add_source_filename("velocity/velocity.ui.min.js") \
    .add_source_filename("clickventure/js/clickventure.js")
