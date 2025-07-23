import { PropsOf } from '@emotion/react';
import * as React from 'react';
import { CreateStyledComponent } from '@emotion/styled';
import { FilteringStyledOptions, StyledOptions } from '@emotion/styled';

type Tags<T> = {
  // normal tags
  [Tag in keyof React.JSX.IntrinsicElements]: CreateStyledComponent<
    {
      theme?: T;
      as?: React.ElementType;
    },
    React.JSX.IntrinsicElements[Tag]
  >;
};

type Component<T> = {
  <
    C extends React.ComponentClass<React.ComponentProps<C>>,
    ForwardedProps extends keyof React.ComponentProps<C> = keyof React.ComponentProps<C>
  >(
    component: C,
    // @ts-ignore
    options: FilteringStyledOptions<React.ComponentProps<C>, ForwardedProps>
  ): CreateStyledComponent<
    Pick<PropsOf<C>, ForwardedProps> & {
      theme?: T;
    },
    {},
    {
      ref?: React.Ref<InstanceType<C>>;
    }
  >;

  <C extends React.ComponentClass<React.ComponentProps<C>>>(
    component: C,
    options?: StyledOptions<React.ComponentProps<C>>
  ): CreateStyledComponent<
    PropsOf<C> & {
      theme?: T;
    },
    {},
    {
      ref?: React.Ref<InstanceType<C>>;
    }
  >;

  <
    C extends React.ComponentType<React.ComponentProps<C>>,
    ForwardedProps extends keyof React.ComponentProps<C> = keyof React.ComponentProps<C>
  >(
    component: C,
    // @ts-ignore
    options: FilteringStyledOptions<React.ComponentProps<C>, ForwardedProps>
  ): CreateStyledComponent<
    Pick<PropsOf<C>, ForwardedProps> & {
      theme?: T;
    }
  >;

  <C extends React.ComponentType<React.ComponentProps<C>>>(
    component: C,
    options?: StyledOptions<React.ComponentProps<C>>
  ): CreateStyledComponent<
    PropsOf<C> & {
      theme?: T;
    }
  >;
};

export type CreateStyled<T> = Component<T> & Tags<T>;
