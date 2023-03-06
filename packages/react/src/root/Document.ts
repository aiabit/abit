import type { ComponentProps } from 'react';
import { createElement } from 'react';

export function Html(props: ComponentProps<'html'>) {
  return createElement('html', props, props.children);
}

export function Head(props: ComponentProps<'head'>) {
  return createElement('head', props, props.children);
}

export function Body(props: ComponentProps<'body'>) {
  return createElement('body', props, props.children);
}
