---
title: Đăng kí Component
type: guide
order: 101
---

> Nếu như chưa làm quen với component bạn có thể bắt đầu từ phần [Cơ bản về component](components.html).

## Tên Component

Component được đặt tên khi đăng kí. Ví dụ khi đăng kí component ở cấp toàn cục, ta thường thấy cú pháp:

```js
Vue.component('my-component-name', { /* ... */ })
```

Tên của component là đối số đầu tiên của `Vue.component`.

Tên của component được đặt theo mục đích sử dụng. Khi sử dụng trực tiếp component trên DOM (trái ngược với trong chuỗi template hay [trong một file component](single-file-components.html)), chúng tôi khuyến khích tuân thủ theo [quy định của W3C](https://www.w3.org/TR/custom-elements/#concepts) để đặt tên cho các thẻ (viết thường và phải nối bằng gach ngang). Điều này sẽ giúp tránh khỏi nguy cơ xung đột với các HTML elements hiện tại cũng như trong tương lai.

Bạn có thể xem những khuyến cáo khác cho việc đặt tên một component tại [hướng dẫn](../style-guide/#Base-component-names-strongly-recommended).

### Quy tắc đặt tên

Bạn có hai lựa chọn khi đặt tên cho một component:

#### Dùng kebab-case

```js
Vue.component('my-component-name', { /* ... */ })
```

Khi định nghĩa một component theo kiểu kebab-case, bạn cũng phải sử dụng kebab-case khi tham chiếu đến element của nó, giống như `<my-component-name>`.

#### Dùng PascalCase

```js
Vue.component('MyComponentName', { /* ... */ })
```

Khi định nghĩa một component ở dạng PascalCase, bạn có thể sử dụng cả hai cách khi tham chiếu tới phần tử web của nó. Điều này có nghĩa là cả hai cách viết `<my-component-name>` và `<MyComponentName>` đều được chấp nhận. Tuy nhiên, cần chú ý là chỉ có các tên của component với kebab-case mới sử dụng được trên DOM (nghĩa là các template không phải dạng chuỗi)

## Đăng kí ở cấp toàn cục

Cho tới nay, chúng ta mới tạo ra những component sử dụng cú pháp `Vue.component`:

```js
Vue.component('my-component-name', {
  // ... các tuỳ biến ...
})
```

Những component này được **đăng kí ở cấp toàn cục**. Điều này có nghĩa là sau khi đăng kí, một component có thể sử dụng trong template của bất cứ đối tượng Vue gốc (`new Vue`) nào. Ví dụ:

```js
Vue.component('component-a', { /* ... */ })
Vue.component('component-b', { /* ... */ })
Vue.component('component-c', { /* ... */ })

new Vue({ el: '#app' })
```

```html
<div id="app">
  <component-a></component-a>
  <component-b></component-b>
  <component-c></component-c>
</div>
```

Điều này còn áp dụng cho tất cả những components con, tức là tất cả ba component trên đều có thể sử dụng _lẫn nhau_.

## Đăng kí ở cấp cục bộ

 Đăng kí component toàn cục thường không phải là một biện pháp lí tưởng. Ví dụ, nếu bạn sử dụng một hệ thống xây dựng hệ thống xây dựng [build system]như Webpack, đăng kí toàn cục cho tất cả các component có nghĩa là kể cả khi bạn không sử dụng một component nữa, component đó vẫn có thể được thêm vào bản build cuối cùng. Điều này là không cần thiết và làm gia tăng khối lượng của JavaScript mà người dùng cần phải tải xuống.

Trong những trường hợp này, bạn có thể định nghĩa component dưới dạng object trong JavaScript:

```js
var ComponentA = { /* ... */ }
var ComponentB = { /* ... */ }
var ComponentC = { /* ... */ }
```

Sau khi khai báo các component, bạn muốn sử dụng trong tuỳ chọn `components`:

```js
new Vue({
  el: '#app'
  components: {
    'component-a': ComponentA,
    'component-b': ComponentB
  }
})
```

Đối với mỗi thuộc tính trong object component, khoá (key) sẽ trở thành tên cuả phần tử tuỳ biến (custom element), trong khi giá trị (value) sẽ bao gồm object `options` cho component.

Lưu ý rằng **bạn sẽ _không_ truy xuất được đến các component được đăng kí cục bộ từ các component con**. Ví dụ, nếu như bạn muốn sử dụng `ComponentA` trong `ComponentB`, bạn phải khai báo như sau:

```js
var ComponentA = { /* ... */ }

var ComponentB = {
  components: {
    'component-a': ComponentA
  },
  // ...
}
```

Hoặc nếu bạn sử dụng module ES2015 (thông qua Babel hay Webpack):

```js
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  },
  // ...
}
```

Chú ý rằng trong ES2015+, đặt một tên biến như `ComponentA` bên trong một object là cách viết tắt của `ComponentA: ComponentA`, trường hợp này tên của biến đồng thời là:

- tên của đối tượng tuỳ biến để sử dụng trong template, và
- tên của biến bao gồm các tuỳ chọn cho component

## Hệ thống Module

Nếu không sử dụng module systems với `import`/`require`, bạn có thể bỏ qua mục này, ngược lại thì chúng tôi có một vài hướng dẫn và lời khuyên cho bạn.

### Đăng kí ở cấp cục bộ trong hệ thống Module 

Nếu vẫn còn đọc đến những dòng này thì khả năng cao là bạn đang sử dụng một hệ thống module như Babel và Webpack. Trong trường hợp này, chúng tôi khuyến khích tạo một file riêng cho mỗi component.

Và bạn sẽ cần phải nhập (`import`) từng component mà bạn muốn sử dụng trước khi đăng kí cục bộ. Ví dụ, trong một file `ComponentB.js` hoặc `ComponentB.vue`:

```js
import ComponentA from './ComponentA'
import ComponentC from './ComponentC'

export default {
  components: {
    ComponentA,
    ComponentC
  },
  // ...
}
```

Giờ thì bạn có thể sử dụng cả `ComponentA` và `ComponentC` trong template của `ComponentB`.

### Tự động đăng kí toàn cục của những component cơ sở

Bạn sẽ có nhiều component dùng chung, ví dụ một component dạng wrapper cho một phần tử như `button` hoặc `input`. Chúng tôi đôi khi gọi những component này là [component cơ sở](../style-guide/#Base-component-names-strongly-recommended) (base component), và những component cơ sở này có khuynh hướng được dùng rất thường xuyên bên trong các component khác.

Kết quả là nhiều component có thể có một danh sách component cơ sở khá dài:

```js
import BaseButton from './BaseButton.vue'
import BaseIcon from './BaseIcon.vue'
import BaseInput from './BaseInput.vue'

export default {
  components: {
    BaseButton,
    BaseIcon,
    BaseInput
  }
}
```

Chỉ để hỗ trợ cho một chút markup trong template:

```html
<BaseInput 
    v-model='searchText' 
    @keydown.enter='search' />
<BaseButton @click='search'>
  <BaseIcon name='search' />
</BaseButton>
```

May thay, sử dụng Webpack (hoặc [Vue CLI 3+](https://github.com/vuejs/vue-cli), công cụ sử dụng Webpack), bạn có thể đăng kí các component cơ sở thông dụng ở cấp toàn cục với `require.context`. Đây là một ví dụ về cách nhúng các component cơ sở ở cấp toàn cục component vào file bắt đầu của ứng dụng (ví dụ: `src/main.js`):

```js
import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context(
  // Đường dẫn tương đối của thư mục component
  './components',
  // có tìm component trong các thư mục con hay không
  false,
  // regular expression để tìm các file component cơ sở
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // Lấy cấu hình của component
  const componentConfig = requireComponent(fileName)

  // Lấy tên của component dùng PascalCase
  const componentName = upperFirst(
    camelCase(
      // Bỏ phần đầu `'./` và đuôi file
      fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
    )
  )

  // Khai báo component cấp toàn cục
  Vue.component(
    componentName,
    // Tìm kiếm các tùy chọn của component trong thuộc tính `.default`
    // Thuộc tính này sẽ khả dụng nếu component sử dụng `export default`
    // nếu không thì dùng chính `componentConfig`
    componentConfig.default || componentConfig
  )
})
```

Nhớ rằng **bạn phải đăng kí component cấp toàn cục trước khi khởi tạo đối tượng Vue gốc (`new Vue`)**. [Đây là một ví dụ](https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/components/_globals.js) trong một ngữ cảnh thực tế.
