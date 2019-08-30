# title

Developing for CKEditor - testing, model<->view conversion, iframes, typescript

# gripes

Typescript lags behind one major version, making it unusable for projects using CKEditor 5 v12.x.x. Any idea when (and if) this will be fixed? Was it abandoned? I found literally one plugin using the TS mappings and that's a bit sad given how much intellisense improves work with libraries as customizable as CKEditor.

# General lay of the land:

I've got a project using CKEditor. We have a customized version of the media plugin to handle inline iframes. All is well as long as the iframe is created by CKEditor. It blows up when we try to instantiate it with an iframe already present. I reproduced the issue in this repository:

<repo url>
<demo url>

The issue is (at least partially to my knowledge) in the early return happening in converters.js

How can I approach debugging this? Is there an article or a training detailing how to develop converters?
