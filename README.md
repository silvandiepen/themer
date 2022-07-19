# Themer

Themer can help you themifying your css.

## Install

`npm install @sil/themer`

## Usage

In your global CSS file.

```scss
@import "@sil/themer/app";
```

In a component file, this version does come with all the functions, but without any output.

```scss
@import "@sil/themer/use";
```

## Customizing

In order to use custom settings, colors or anything. You have to create a `themer.json` file in the root of your project. The root file can/should contain these custom settings.

Example `themer.json`:

```
{
  "colors": {
    "background": "#ffffff",
    "foreground": "#111111",
    "primary": "#01eeff",
    "secondary": "#f7166c",
    "tertiary": "#6a2ef7"
  },
  "settings": {
    "prefix": "my-project",
  }
}
```

When the root file is created, you run ```npx @sil/themer init` in your project. This will create a `theme.scss` file in the `src/style` folder.

:::warning 
This will override any existing file, if the folder doesn't exist, it will be created. If you want the file anywhere else, you will have to move the file manually.
:::

:::info 
If you make changes to the themer.json, you will have to re-run the script.
:::

When the theme.scss file is created, you have to add import it to your file'

```scss
@import "theme.scss";
@import "@sil/themer/app"; // or -> @import "sil/themer/use";
```

:::tip 
for components, create one file which includes the use and the theme at once. This file can be included again in all your components.
:::

All settings have been split up into; settings, base, colors and typography.

#### Settings

| key             | value                  |
| --------------- | ---------------------- |
| prefix          | `""`                   |
| colorsModes     | `true`                 |
| colorsSteps     | `10, 25, 50, 75, 90`   |
| colorsShades    | `true`                 |
| colorText       | `true`                 |
| breakpointNames | `small, medium, large` |
| breakpointSizes | `0, 720, 1200`         |

#### Base

| key          | value                            |
| ------------ | -------------------------------- |
| borderRadius | `1em`                            |
| shadow       | `0 3px 4px 0 rgba(0, 0, 0, 0.1)` |
| space        | `1em`                            |
| transition   | `0.3s ease-in-out`               |

#### Colors

| key        | value     |
| ---------- | --------- |
| background | `#ffffff` |
| foreground | `#111111` |
| primary    | `#01eeff` |
| secondary  | `#f7166c` |
| tertiary   | `#6a2ef7` |
| caution    | `#fed02f` |
| warning    | `#fd8324` |
| error      | `#fc1b1c` |
| info       | `#7abffc` |
| success    | `#54d577` |

#### Base

| key          | value                            |
| ------------ | -------------------------------- |
| borderRadius | `1em`                            |
| shadow       | `0 3px 4px 0 rgba(0, 0, 0, 0.1)` |
| space        | `1em`                            |
| transition   | `0.3s ease-in-out`               |

## Settings

By default all defined code will be outputed, but if you don't need the color shades, or automatic text colors. You can also disable this.

```scss
$theme-settings: (
  prefix: "my-project",
);

@import "@sil/themer/app";
```

## Functions & Mixins

### Variable

Variable is the main function of themer, variable will help you create the custom properties automatically based on the information given. It will determine if the value given has a default and automatically add these defaults.

> tip: You can also just use `v` instead of `variable`

**input**

```scss
// $theme-settings: ( prefix: 'myProject' );

.example {
  background-color: v(backgroundColor, primary);
  color: v(Color, foreground);
  top: 0;
}
```

**output**

```css
.example {
  background-color: var(
    --my-project-example-background-color,
    var(--my-project-primary, #ff9900)
  );
  color: var(--my-project-example-color, var(--my-project-foreground, #ffffff));
  top: 0;
}
```

### Property

To make it even easier and faster, there is the property mixin. The property mixin will automatically determine which property will have custom property and create the custom properties based on it's parent class and the prefix determined in settings.

**input**

```scss
// $theme-settings: ( prefix: 'myProject' );

.example {
  @include property(
    (
      background-color: background,
      color: foreground,
      top: 0,
    )
  );
}
```

**output**

```css
.example {
  background-color: var(
    --my-project-example-background-color,
    var(--my-project-background, #ffffff)
  );
  color: var(--my-project-example-color, var(--my-project-foreground, #ffffff));
  top: 0;
}
```

### CustomProperties

The custom properties mixin creates a list of custom properties based on the settings provided. The CustomProperties is an internal mixin which is used in the app file to create all the defaults.

**input**

```scss
// $theme-settings: ( prefix: 'myProject' );

// Default theme base
$base: (
  borderRadius: 1em,
  shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.1),
  space: 1em,
  transition: 0.3s ease-in-out,
);

:root {
  @include customProperties($base);
}
```

**output**

```css
:root {
  --my-project-border-radius: 1em;
  --my-project-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.1);
  --my-project-space: 1em;
  --my-project-transition: 0.3s ease-in-out;
}
```

[gist=2d9aff65094156a9f52f67594e8000d0]
