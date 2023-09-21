import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Checkbox } from 'antd';
import styles from './style.module.scss';

class LiveSearch extends React.Component {
  state = {
    showSearch: false,
    searchText: '',
  }

  UNSAFE_componentWillMount() {
    document.addEventListener('keydown', this.handleKeyDown, false);
  }

  showLiveSearch = () => {
    setTimeout(() => {
      this.searchInput.focus();
    }, 300);
    this.setState({
      showSearch: true,
    });
  }

  changeSearchText = e => {
    this.setState({
      searchText: e.target.value,
    });
  }

  hideLiveSearch = () => {
    this.searchInput.blur();
    this.setState({
      showSearch: false,
      searchText: '',
    });
  }

  handleKeyDown = event => {
    const { showSearch } = this.state;
    if (showSearch) {
      const key = event.keyCode.toString();
      if (key === '27') {
        this.hideLiveSearch();
      }
    }
  }

  handleNode = node => {
    this.searchInput = node;
  }

  render() {
    const { showSearch, searchText } = this.state;

    return (
      <div className="d-inline-block mr-4">
        <Input
          className={styles.extInput}
          placeholder="Nhập từ khoá tìm kiếm"
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
          // onFocus={this.showLiveSearch}
        />
        <div
          className={`${
            showSearch ? `${styles.livesearch} ${styles.livesearchVisible}` : styles.livesearch
          }`}
          id="livesearch"
        >
          <button className={styles.close} onClick={this.hideLiveSearch} type="button">
            <span className="utils__visibilityHidden">Закрыть</span>
            <i className="icon-cross" />
          </button>
          <div className="container-fluid">
            <div className={styles.wrapper}>
              <div className={styles.logoContainer}>
                <img alt="" className={styles.logo} src="/resources/images/logo.png" />
              </div>
              <input
                ref={this.handleNode}
                className={styles.searchInput}
                id="livesearchInput"
                onChange={this.changeSearchText}
                placeholder="Type to search..."
                type="search"
                value={searchText}
              />
              <ul className={styles.options}>
                <li className={`${styles.option} ${styles.optionCheckbox}`}>
                  <Checkbox>Search within page</Checkbox>
                </li>
                <li className={styles.option}>Press enter to search</li>
              </ul>
              <div className={styles.results}>
                <div className={styles.resultsTitle}>
                  <span>Pages Search Results</span>
                </div>
                <div className="row">
                  <div className="col-lg-4">
                    <div className={styles.resultContent}>
                      <div
                        className={styles.resultThumb}
                      >
                        #1
                      </div>
                      <div className={styles.result}>
                        <div className={styles.resultText}>Text from input field must be here</div>
                        <div className={styles.resultSource}>In some partition</div>
                      </div>
                    </div>
                    <div className={styles.resultContent}>
                      <div
                        className={styles.resultThumb}
                      >
                        KF
                      </div>
                      <div className={styles.result}>
                        <div className={styles.resultText}>Text from input field must be here</div>
                        <div className={styles.resultSource}>In some partition</div>
                      </div>
                    </div>
                    <div className={styles.resultContent}>
                      <div
                        className={styles.resultThumb}
                      >
                        GF
                      </div>
                      <div className={styles.result}>
                        <div className={styles.resultText}>Text from input field must be here</div>
                        <div className={styles.resultSource}>In some partition</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className={styles.resultContent}>
                      <div className={styles.resultThumb}>01</div>
                      <div className={styles.result}>
                        <div className={styles.resultText}>Text from input field must be here</div>
                        <div className={styles.resultSource}>In some partition</div>
                      </div>
                    </div>
                    <div className={styles.resultContent}>
                      <div className={styles.resultThumb}>02</div>
                      <div className={styles.result}>
                        <div className={styles.resultText}>Text from input field must be here</div>
                        <div className={styles.resultSource}>In some partition</div>
                      </div>
                    </div>
                    <div className={styles.resultContent}>
                      <div className={styles.resultThumb}>03</div>
                      <div className={styles.result}>
                        <div className={styles.resultText}>Text from input field must be here</div>
                        <div className={styles.resultSource}>In some partition</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LiveSearch;
