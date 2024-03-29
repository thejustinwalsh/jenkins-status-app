import {forwardRef} from 'react';
import {getFontSize} from '@tamagui/font-size';
import {useGetThemedIcon} from '@tamagui/helpers-tamagui';
import {YStack} from '@tamagui/stacks';
import {wrapChildrenInText} from '@tamagui/text';
import {Spacer, getTokens, getVariableValue, useProps} from '@tamagui/web';
import {
  ListItemFrame,
  ListItemSubtitle,
  ListItemText,
  ListItemTitle,
  Progress,
  themeable,
} from 'tamagui';

import type {PropsWithoutMediaStyles} from '@tamagui/web';
import type {ListItemProps, ProgressProps, TamaguiElement} from 'tamagui';

type CustomListItemProps = Pick<ProgressProps, 'value' | 'max'> & {
  hasProgress?: boolean;
} & ListItemProps;

const useListItem = (
  propsIn: CustomListItemProps,
  {
    Text = ListItemText,
    Subtitle = ListItemSubtitle,
    Title = ListItemTitle,
  }: {
    Title?: any;
    Subtitle?: any;
    Text?: any;
  } = {Text: ListItemText, Subtitle: ListItemSubtitle, Title: ListItemTitle},
): {props: PropsWithoutMediaStyles<CustomListItemProps>} => {
  // careful not to destructure and re-order props, order is important
  const props = useProps(propsIn);

  const {
    children,
    icon,
    iconAfter,
    noTextWrap,
    scaleIcon = 1,
    scaleSpace = 1,
    unstyled = false,
    subTitle,
    title,

    // text props
    color,
    fontWeight,
    fontSize,
    fontFamily,
    letterSpacing,
    textAlign,
    ellipse,

    // progress props
    value,
    max,
    hasProgress,

    ...rest
  } = props;

  const textProps = {
    color,
    fontWeight,
    fontSize,
    fontFamily,
    letterSpacing,
    textAlign,
    ellipse,
    children,
  };

  const size = props.size || '$true';
  const iconSize = getFontSize(size as any) * scaleIcon;
  const themedIcon = useGetThemedIcon({size: iconSize, color: color as any})(
    icon,
  );
  const themedIconAfter = useGetThemedIcon({size: iconSize, color: undefined})(
    iconAfter,
  );
  const spaceSize =
    // @ts-expect-error
    getVariableValue(getTokens().space[props.space] ?? iconSize) * scaleSpace;

  const contents = wrapChildrenInText(Text, textProps);

  return {
    props: {
      ...rest,
      children: (
        <>
          {themedIcon ? (
            <>
              {themedIcon}
              <Spacer size={spaceSize} />
            </>
          ) : null}
          {/* helper for common title/subtitle pattern */}
          {/* biome-ignore lint/complexity/noExtraBooleanCast: <explanation> */}
          {title || subTitle ? (
            <YStack flex={1}>
              {noTextWrap === 'all' ? (
                title
              ) : (
                <Title size={size}>{title}</Title>
              )}
              {hasProgress ? (
                <ListItemProgress value={value} max={max} />
              ) : subTitle ? (
                <>
                  {typeof subTitle === 'string' && noTextWrap !== 'all' ? (
                    // TODO: can use theme but we need to standardize to alt themes
                    // or standardize on subtle colors in themes
                    <Subtitle unstyled={unstyled} size={size}>
                      {subTitle}
                    </Subtitle>
                  ) : (
                    subTitle
                  )}
                </>
              ) : null}
              {contents}
            </YStack>
          ) : (
            contents
          )}
          {themedIconAfter ? (
            <>
              <Spacer size={spaceSize} />
              {themedIconAfter}
            </>
          ) : null}
        </>
      ),
    },
  };
};

function ListItemProgress({value, max}: ProgressProps) {
  return (
    <YStack height="$0.75" marginVertical="$2">
      <Progress size="small" opacity={0.5} value={value} max={max}>
        <Progress.Indicator animation="quick" />
      </Progress>
    </YStack>
  );
}

const StatusListItem = themeable(
  forwardRef<TamaguiElement, CustomListItemProps>((propsIn, ref) => {
    const {...listItemProps} = propsIn;

    const {props} = useListItem(listItemProps, {
      Title: ListItemTitle,
      Text: ListItemText,
      Subtitle: undefined,
    });

    return <ListItemFrame {...props} ref={ref} />;
  }),
);

export default StatusListItem;
