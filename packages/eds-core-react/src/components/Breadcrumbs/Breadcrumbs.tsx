import {
  forwardRef,
  useState,
  Fragment,
  HTMLAttributes,
  ReactNode,
  Children as ReactChildren,
} from 'react'
import styled from 'styled-components'
import { breadcrumbs as tokens } from './Breadcrumbs.tokens'
import { Typography } from '../Typography'
import { spacingsTemplate } from '@equinor/eds-utils'

const { spacings, typography, states } = tokens

const OrderedList = styled.ol<{ $wrap: boolean }>`
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;
  flex-wrap: wrap;
  flex-wrap: ${({ $wrap }) => ($wrap ? 'wrap' : 'nowrap')};
`

const ListItem = styled.li`
  display: inline-block;
  min-width: 30px;
`

const Separator = styled(Typography)`
  color: ${typography.color};
  ${spacingsTemplate(spacings)}
`

const Collapsed = styled(Typography)`
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      text-decoration: underline;
      color: ${states.hover.typography.color};
    }
  }
  color: ${typography.color};
  text-decoration: none;
`

export type BreadcrumbsProps = {
  /** Collapses the list of breadcrumbs so that only the first
   * and last breadcrumb will be shown, with an ellipsis in between
   * @default false
   */
  collapse?: boolean
  /** Will not wrap breadcrumbs when set to false, but will instead trunkate each breadcrumb when viewport narrows
   * @default true
   */
  wrap?: boolean
  /** Children should be of Breadcrumb component */
  children: ReactNode
} & HTMLAttributes<HTMLElement>

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  function Breadcrumbs({ children, collapse, wrap = true, ...rest }, ref) {
    const props = {
      ...rest,
      ref,
    }

    const [expanded, setExpanded] = useState(false)

    const collapsedCrumbs = (allCrumbs: JSX.Element[]) => {
      const handleExpandClick = (
        e:
          | React.KeyboardEvent<HTMLAnchorElement>
          | React.MouseEvent<HTMLAnchorElement>,
      ) => {
        setExpanded(true)
        const { key } = e as React.KeyboardEvent
        if (key === 'Enter') {
          setExpanded(true)
        }
      }

      if (allCrumbs.length < 3) {
        return allCrumbs
      }

      return [
        allCrumbs[0],
        <Fragment key="collapsed">
          <ListItem style={{ minWidth: 'unset' }}>
            <Collapsed
              link
              role="button"
              variant="body_short"
              onClick={handleExpandClick}
              onKeyPress={handleExpandClick}
              tabIndex={0}
            >
              …
            </Collapsed>
          </ListItem>
          <li aria-hidden>
            <Separator variant="body_short">/</Separator>
          </li>
        </Fragment>,
        allCrumbs[allCrumbs.length - 1],
      ]
    }

    const allCrumbs = ReactChildren.toArray(children).map((child, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <Fragment key={`breadcrumb-${index}`}>
        <ListItem>{child}</ListItem>
        {index !== ReactChildren.toArray(children).length - 1 && (
          <li aria-hidden>
            <Separator variant="body_short">/</Separator>
          </li>
        )}
      </Fragment>
    ))

    return (
      <nav {...props} aria-label="breadcrumbs">
        <OrderedList $wrap={wrap}>
          {collapse && !expanded ? collapsedCrumbs(allCrumbs) : allCrumbs}
        </OrderedList>
      </nav>
    )
  },
)

// Breadcrumbs.displayName = 'eds-breadcrumbs'
