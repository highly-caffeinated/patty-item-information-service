import React from 'react';
import axios from 'axios';

import Rating from './Rating';
import Info from './Info';
import Selector from './Selector';
import ExtDetails from './ExtDetails';
import Seller from './Seller';
import BING_KEY from '../../keys/BING_API_KEY';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      rating: {
        name: '',
        sales: -1,
        stars: -1,
      },
      info: {
        tags: [],
        price: -1,
        availability: false,
      },
      selectors: [],
      extDetails: {
        description: '',
      },
      shipping: {
        origin: {
          latitude: '47.839958190918',
          longitude: '-122.206146240234',
        },
        exchanges: false,
      },
      shopPolicy: {
        lastUpdated: '',
        returns: false,
        noReturnTypes: [],
      },
      seller: {
        name: '',
        role: '',
        imageURL: '',
      },
      userZip: '98105',
      distance: 0,
      price: 'Free',
    };
    this.getData = this.getData.bind(this);
    this.changeZip = this.changeZip.bind(this);
  }

  componentDidMount() {
    const { userZip } = this.state;
    this.getData(userZip);
  }

  getData(zip) {
    const randNum = Math.round(Math.random() * 10000000).toString(16);
    axios.get(`/api/item/${randNum}`)
      .then((data) => {
        let { seller, rating, sales, employee, employee_position, employee_ava, policy_updated, policy_acceptReturn, policy_allowExchange, policy_types, item, item_tags, price, item_availability, item_description, selector, shipping_origin } = data.data[0];
        rating = {
          name: seller,
          sales: sales,
          stars: rating
        };
        let info = {
          tags: item_tags,
          price: price,
          availability: item_availability
        };
        let selectorFormat = () => {
          let arr = [];
          for (var keys in selector) {
            let obj = {
              "options": selector[keys],
              "name": keys,
            }
            arr.push(obj);
          }
          return arr;
        };
        let selectors = selectorFormat();
        let extDetails = {
          description: item_description,
        };
        let shipping = {
          origin: {
            latitude: shipping_origin[0].toString(),
            longitude: shipping_origin[1].toString(),
          },
          exchanges: policy_allowExchange,
        };
        let shopPolicy = {
          lastUpdated: policy_updated,
          returns: policy_acceptReturn,
          noReturnTypes: policy_types,
        };
        seller = {
          name: employee,
          role: employee_position,
          imageURL: employee_ava,
        };
        const lat0 = shipping.origin.latitude;
        const long0 = shipping.origin.longitude;
        axios.get(`http://dev.virtualearth.net/REST/v1/Locations?countryRegion=US&postalCode=${zip}&key=${BING_KEY}`)
          .then((zipData) => {
            const resources = zipData.data.resourceSets[0].resources[0];
            const lat1 = resources.geocodePoints[0].coordinates[0];
            const long1 = resources.geocodePoints[0].coordinates[1];
            axios.get(`https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=${lat0},${long0}&destinations=${lat1},${long1}&travelMode=driving&key=An73bmmGtDp0dF5-B3ckWPunbeQJrKgrE73hODpN55d7gHhzsD-NOnuOpYi03YmB`)
              .then((distanceData) => {
                const distanceResults = distanceData.data.resourceSets[0].resources[0];
                const distance = distanceResults.results[0].travelDuration;
                let price;
                if (distance > 1440) {
                  price = '$4.99';
                } else {
                  price = 'Free';
                }
                this.setState({
                  rating,
                  info,
                  selectors,
                  shipping,
                  extDetails,
                  shopPolicy,
                  seller,
                  distance,
                  price,
                });
              });
          });
      });
  }

  changeZip(userZip) {
    this.getData(userZip);
    this.setState({ userZip });
  }

  render() {
    const {
      rating, info, selectors, shipping, extDetails, shopPolicy, seller, distance, price,
    } = this.state;
    extDetails.sales = rating.sales;
    extDetails.availability = info.availability;
    const { name } = rating;
    return (
      <div className="croxy-cart-col">
        <Rating rating={rating} />
        <Info info={info} />
        <Selector selectors={selectors} />
        <ExtDetails
          extDetails={extDetails}
          distance={distance}
          shipping={shipping}
          shopPolicy={shopPolicy}
          name={name}
          price={price}
          changeZip={this.changeZip}
        />
        <Seller seller={seller} shopName={name} />
      </div>
    );
  }
}

export default App;
