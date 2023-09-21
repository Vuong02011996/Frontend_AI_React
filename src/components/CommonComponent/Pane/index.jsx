import { memo } from 'react'
import PropTypes from 'prop-types'

const Pane = memo(({ as = 'div', children, ...props }) => {
  const Element = `${as}`
  return <Element {...props}>{children}</Element>
})

Pane.propTypes = {
  as: PropTypes.string,
  children: PropTypes.node
}

export default Pane