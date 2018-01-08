# <img src="https://github.com/pip-webui/pip-webui/raw/master/doc/Logo.png" alt="Pip.WebUI Logo" style="max-width:30%"> <br/> Attachable behaviors

![](https://img.shields.io/badge/license-MIT-blue.svg)

Pip.WebUI.Behaviors module contains behaviors that can be attached to existing controls or pages

* **Focusable** - allows to navigate over focusable controls using arrow keys.

**Using** 

To color div with orange color by pressing arrow buttons

```html
<div pipFocused focusedColor="orange">
    <div class="pip-focusable">Focusable</>
    <div class="pip-focusable">Focusable</>
    <div class="pip-focusable">Focusable</>
    <div class="pip-focusable">Focusable</>
    <div class="pip-focusable">Focusable</>
</div>
```

**More generalized example in the image**

<a href="https://github.com/pip-webui2/pip-webui2-behaviors/raw/master/doc/images/focused.png" style="display: block; text-align: center;">
    <img style="max-width: 300px" src="https://github.com/pip-webui2/pip-webui2-behaviors/raw/master/doc/images/focused.png"/>
</a>


* **Selectable** - allows to navigate over non-focuseable elements using arrow keys
* **Draggable** - implements drag & drop functionality
* **Infinite Scroll** - allows to upload data in chunks while user is scrolling

## <a name="license"></a>License

This module is released under [MIT license](License) and totally free for commercial and non-commercial use.
