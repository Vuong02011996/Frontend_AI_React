import React from 'react';
import { connect, Link, withRouter } from 'umi';
import { reduce, isArray, head } from 'lodash';
import validator from 'validator';
import PropTypes from 'prop-types';
import styles from './style.module.scss';

const mapStateToProps = ({ menu }) => ({
  menuLeftData: menu.menuLeftData,
});

@withRouter
@connect(mapStateToProps)
class Breadcrumbs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumb: [],
    };
  }

  componentDidMount() {
    this.setBreadcrumbs(this.props);
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(newProps) {
    this.setBreadcrumbs(newProps);
  }

  setBreadcrumbs = (props) => {
    const { menuLeftData } = this.props;
    this.setState({
      breadcrumb: this.getBreadcrumb(props, menuLeftData),
    });
  };

  getPath(data, url, parents = []) {
    const items = reduce(
      data,
      (result, entry) => {
        if (result?.length) {
          return result;
        }
        if (entry.url === url) {
          return [entry].concat(parents);
        }

        if (isArray(entry.url) && entry.url.find((item) => item === this.convertPathname(url))) {
          return [entry].concat(parents);
        }

        if (entry.children) {
          const nested = this.getPath(entry.children, url, [entry].concat(parents));
          return (result || []).concat(nested.filter((e) => !!e));
        }
        return result;
      },
      [],
    );
    return items?.length > 0 ? items : [false];
  }

  convertPathname = (pathname) => {
    if (pathname) {
      const listItemPath = pathname.split('/');
      return listItemPath
        .map((item) => (validator.isUUID(item) || Number.parseInt(item, 10) ? ':id' : item))
        .join('/');
    }
    return '';
  };

  getBreadcrumb = (props, items) => {
    const [activeMenuItem, ...path] = this.getPath(items, props.location.pathname);
    if (activeMenuItem && path?.length) {
      return path.reverse().map((item, index) => {
        if (index === path?.length - 1) {
          return (
            <Link
              className="text-muted"
              to={head(activeMenuItem.url) ? head(activeMenuItem.url) : '/'}
              key={item.key}
            >
              <span className={styles.arrow} />
              <strong className={styles.title}>{activeMenuItem.title}</strong>
            </Link>
          );
        }
        return (
          <Link
            className="text-muted"
            to={head(activeMenuItem.url) ? head(activeMenuItem.url) : '/'}
            key={item.key}
          >
            <span className={styles.arrow} />
            <strong className={styles.title}>{activeMenuItem.title}</strong>
          </Link>
        );
      });
    }
    return (
      <Link className="text-muted" to={head(activeMenuItem.url) ? head(activeMenuItem.url) : '/'}>
        <strong className={styles.title}>{activeMenuItem.title}</strong>
      </Link>
    );
  };

  render() {
    const { breadcrumb } = this.state;
    const { last, className } = this.props;
    return (
      <div className={`${styles.breadcrumbs} ${className}`}>
        <div className={styles.path}>
          {breadcrumb}
          {last && (
            <span>
              <span className={`${styles.arrow} text-muted`} />
              <strong className={styles.title}>{last}</strong>
            </span>
          )}
        </div>
      </div>
    );
  }
}

Breadcrumbs.propTypes = {
  menuLeftData: PropTypes.any,
  last: PropTypes.string,
  className: PropTypes.string,
};

Breadcrumbs.defaultProps = {
  menuLeftData: null,
  last: null,
  className: '',
};

export default Breadcrumbs;
