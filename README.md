# Themer


Themer can help you themifying your css. 



## Install

```npm install @sil/themer```

## Usage



```

```

## Customizing

All settings have been split up into; settings, base, colors and typography.

#### Settings

| key                   | value                  |
| --------------------- | ---------------------- |
| prefix                | ""                     |
| properties.base       | true                   |
| properties.typography | true                   |
| properties.colors     | true                   |
| colors.shadeSteps     | ( 10, 25, 50, 75, 90 ) |
| colors.shades         | true                   |
| colors.text           | true                   |
  

#### Base

| key          | value                          |
| ------------ | ------------------------------ |
| borderRadius | 1em                            |
| shadow       | 0 3px 4px 0 rgba(0, 0, 0, 0.1) |
| space        | 1em                            |
| transition   | 0.3s ease-in-out               |

#### Colors

| key        | value   |
| ---------- | ------- |
| background | #ffffff |
| foreground | #111111 |
| primary    | #01eeff |
| secondary  | #f7166c |
| tertiary   | #6a2ef7 |
| caution    | #fed02f |
| warning    | #fd8324 |
| error      | #fc1b1c |
| info       | #7abffc |
| success    | #54d577 |
#### Base

| key          | value                          |
| ------------ | ------------------------------ |
| borderRadius | 1em                            |
| shadow       | 0 3px 4px 0 rgba(0, 0, 0, 0.1) |
| space        | 1em                            |
| transition   | 0.3s ease-in-out               |


## Settings

By default all defined code will be outputed, but if you don't need the color shades, or automatic text colors. You can also disable this.


```

```


## Functions & Mixins


### Variable

Variable is the main function of themer, variable will help you create the custom properties automatically based on the information given. It will determine if the value given has a default and automatically add these defaults. 

__input__
```scss

// $theme-settings: ( prefix: 'myProject' );

.example{
    background-color: variable(exampleBackgroundColor,background);
    background-color: variable(exampleColor,foreground);
    top: 0;
}
```

__output__
```scss
.example{
    background-color: var(--my-project-example-background-color, var(--my-project-background, #ffffff));
    color: var(--my-project-example-color, var(--my-project-foreground, #ffffff));
    top: 0;
}
```

### Property

To make it even easier and faster, there is the property mixin. The property mixin will automatically determine which property will have custom property and create the custom properties based on it's parent class and the prefix determined in settings.

__input__
```scss

// $theme-settings: ( prefix: 'myProject' );

.example{
    @include property(
        (
            background-color: background,
            color: foreground,
            top: 0
        )
    );
}
```

__output__
```scss
.example{
    background-color: var(--my-project-example-background-color, var(--my-project-background, #ffffff));
    color: var(--my-project-example-color, var(--my-project-foreground, #ffffff));
    top: 0;
}
```


### CustomProperties

The custom properties mixin creates a list of custom properties based on the settings provided. The CustomProperties is an internal mixin which is used in the app file to create all the defaults.

__input__
```scss

// $theme-settings: ( prefix: 'myProject' );

// Default theme base
$base: (
  borderRadius: 1em,
  shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.1),
  space: 1em,
  transition: 0.3s ease-in-out,
);

:root{
    @include customProperties($base);
}
```

__output__
```scss
:root{
    --my-project-border-radius: 1em;
    --my-project-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.1);
    --my-project-space: 1em;
    --my-project-transition: 0.3s ease-in-out;
 }
```

