
# nodeCanvasDice

The reason mobile web apps feel slow when compared to native
apps, is the DOM. Today, most modern mobile browsers, have
implemented hardware(CPU) acceleration for their canvas element.
This creates an oportunity to develope extremely performant,
web-deployed, single-page-applications (SPA).

<Surface>
Surface is a top-level component. Think of surface as a
drawing canvas in which you can render other components.

<Layer>
Layer is the the base component by which other components build upon.
Common styles and properties such as top, width, left, height,
backgroundColor and zIndex are expressed at this level.

<Group>
Group is a container component. Because we require that all
components return a single component in render(), Groups can be
useful for parenting a set of child components.
The Group is also an important component for optimizing scrolling
performance, as it allows our rendering engine to cache many
expensive rendering operations.

<Text>
Text is a flexible component that supports multi-line truncation,
something which has historically been difficult and very expensive
to do in DOM.

<Image>
Image is exactly what you think it is. However, it adds the ability
to hide an image until it is fully loaded and optionally fade it in on load.

## How to use

## License

[MIT](LICENSE)
