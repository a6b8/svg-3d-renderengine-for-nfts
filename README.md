<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/assets/headlines/custom/svg-3d-renderengine-for-on-chain-nfts.svg" height="45px" alt="SVG 3D Renderengine for on-chain NFTs" name="# SVG 3D Renderengine for on-chain NFTs">
</a>

<img src="https://github.com/a6b8/a6b8/blob/main/assets/additional/svg-3d-renderengine-for-nfts/nft-headline.jpg?raw=true" width="500px" alt="Examples" name="examples">

A 3D Renderengine which is perfectly suited for on-chain / composable SVGs. 

This project is heavily inspired by [LoneCoders Code-It-Yourself! 3D Graphics Engine](https://www.youtube.com/watch?v=ih20l3pJoeU) Youtube Series. Which inspired me to build my own 3D SVG Renderengine.

**The Goal**  
is to generate a SVG with a 3D representation on chain with less data as possible. A solidity smart contract has a limit of 24 kb. Which means the engine should have less then 10-15kb (currently 20-25kb). BUT a javascript version can also generate a 3D SVG off-chain and send the points to the contract.

<br>

<a href="#headline">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/assets/headlines/default/examples.svg" height="45px" alt="Examples" name="examples">
</a>

<img src="https://github.com/a6b8/a6b8/blob/main/assets/additional/svg-3d-renderengine-for-nfts/preview.png?raw=true" width="300px"><br>
<br>

> DEMO: 
[https://a6b8.github.io/svg-3d-renderengine-for-nfts/](https://a6b8.github.io/svg-3d-renderengine-for-nfts/)  

<br>

<a href="#headline">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/assets/headlines/default/table-of-contents.svg" height="45px" alt="Table of Contents" name="table-of-contents">
</a>

1. [Examples](#examples)<br>
2. [Contributing](#contributing)<br>
3.  [License](#license)<br>
4.  [Code of Conduct](#code-of-conduct)<br>
5.  [Support my Work](#support-my-work)<br>

<br>

<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/assets/headlines/default/contributing.svg" height="45px" alt="Contributing" name="contributing">
</a>

Bug reports and pull requests are welcome on GitHub at https://github.com/a6b8/ethereum-read-functions. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](https://github.com/a6b8/statosio/blob/master/CODE_OF_CONDUCT.md).

<br>


<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/assets/headlines/default/limitations.svg" height="45px" name="limitations" alt="Limitations">
</a>

**Why not use an existing Renderengine?**
First of all, it´s fun do it by my own! Second it make a lot of sense to think about every line of code for the new purpose of on-chain svg.

**Why do you start with javascript?**
Well, for development i need a template for comparison anyway. Plus a web interface is the perfect fit for this type of project.

**But solidity have no floating numbers.**
Yes! [This](https://github.com/Sikorkaio/sikorka/blob/master/contracts/trigonometry.sol) should be a good starting point

**What are the reduction strategies besides traditional 3D Renderengines have?**
- [CSG Operations](https://evanw.github.io/csg.js/) for recursivly merging polygons together.
- Reduce faces by grouping into grey areas.
- ...

How did you start?
This project is heavily inspired by LoneCoder´s Code-It-Yourself! 3D Graphics Engine Youtube Series. Which inspired me to build my own SVG version.

<br>

<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/assets/headlines/default/credits.svg" height="45px" name="credits" alt="Credits">
</a>

- [LoneCoders Code-It-Yourself! 3D Graphics Engine](https://www.youtube.com/watch?v=ih20l3pJoeU)

<br>

<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/assets/headlines/default/license.svg" height="45px" alt="License" name="license">
</a>

The module is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

<br>

<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/assets/headlines/default/code-of-conduct.svg" height="45px" alt="Code of Conduct" name="code-of-conduct">
</a>
    
Everyone interacting in the Statosio project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/a6b8/ethereum-read-functions/blob/main/CODE_OF_CONDUCT.md).

<br>

<a href="#table-of-contents">
<img href="#table-of-contents" src="https://raw.githubusercontent.com/a6b8/a6b8/main/assets/headlines/default/star-us.svg" height="45px" name="star-us" alt="Star us">
</a>

Please ⭐️ star this Project, every ⭐️ star makes us very happy!

Visit: [https://gitcoin.co/grants/4986/svg-3d-renderengine-for-nfts](https://gitcoin.co/grants/4986/svg-3d-renderengine-for-nfts)