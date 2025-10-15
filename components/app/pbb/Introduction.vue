<template>
	<div class="app-paris-basketball-introduction grid-inner">





    	<div class="app-paris-basketball-introduction__f-row__content">
      <EKinesis
        :speed="12"
        class="app-paris-basketball-introduction__arrow"
	    >
        <img src="/imgs/arrow.png" alt="Arrow" />
      </EKinesis>
			<ERichText
				ref="maintitle"
				tag="h2"
				weight="regular"
				:content="contents.maintitle"
				class="app-paris-basketball-introduction__f-row__content__title"
			/>

			<ERichText
				ref="title1"
				tag="h4"
				weight="regular"
				:content="contents.title1"
				class="app-paris-basketball-introduction__f-row__content__subtitle"
			/>

			<ERichText
				ref="paragraph1"
				tag="p"
				weight="medium"
				:content="contents.paragraph1"
				class="app-paris-basketball-introduction__f-row__content__text"
			/>
   		</div>

	    <EKinesis
			:speed="7.5"
			class="app-paris-basketball-introduction__visual-transparent"
	    >
	    	<svg width="133" height="125" viewBox="0 0 133 125" fill="none" xmlns="http://www.w3.org/2000/svg">
				<g clip-path="url(#clip0_27_1157)">
					<path d="M59.0353 34.2019C79.4921 28.7205 100.549 40.9059 106.052 61.4435C111.555 81.9812 99.4296 103.058 78.9551 108.544C58.4807 114.03 37.4417 101.84 31.9386 81.3021C26.4356 60.7645 38.5785 39.6833 59.0353 34.2019ZM58.4677 32.0837C53.1787 33.5009 48.3232 35.9098 44.0549 39.2478C39.9249 42.4752 36.4966 46.4327 33.8667 51.0042C31.2367 55.5756 29.5358 60.5339 28.8157 65.7371C28.074 71.1334 28.4183 76.5401 29.8399 81.8455C31.2615 87.1509 33.6714 92.023 37.0071 96.3079C40.2323 100.454 44.1851 103.9 48.7479 106.541C53.3112 109.186 58.2589 110.899 63.4493 111.629C68.833 112.383 74.2242 112.044 79.5132 110.627C84.8023 109.209 89.6577 106.8 93.926 103.462C98.056 100.235 101.487 96.277 104.114 91.7061C106.742 87.1352 108.445 82.1763 109.165 76.9731C109.909 71.5762 109.563 66.1701 108.141 60.8648C106.719 55.5594 104.31 50.6872 100.974 46.4024C97.7487 42.2564 93.7965 38.8128 89.2331 36.1688C84.6698 33.5247 79.722 31.8116 74.5316 31.0816C69.1662 30.3249 63.7568 30.6665 58.4677 32.0837Z" fill="#FF0000"/>
					<path d="M59.5981 36.3023C64.3113 35.0394 69.1494 34.737 73.9314 35.4081C78.5601 36.0632 82.9867 37.5791 87.063 39.9409C91.1122 42.2815 94.6711 45.3868 97.5382 49.0879C100.513 52.9262 102.666 57.2645 103.933 61.9922C105.2 66.7199 105.509 71.5714 104.847 76.3652C104.201 81.0053 102.696 85.4414 100.349 89.5243C98.0207 93.5808 94.9291 97.1444 91.2423 100.013C87.4189 102.99 83.0954 105.143 78.3822 106.406C73.6691 107.669 68.831 107.971 64.049 107.3C59.4202 106.645 54.9936 105.129 50.918 102.769C46.8687 100.429 43.3098 97.3234 40.4427 93.6223C37.4679 89.784 35.3145 85.4457 34.0477 80.718C32.781 75.9903 32.4719 71.1388 33.1338 66.345C33.7801 61.7049 35.2851 57.2688 37.6321 53.1859C39.9602 49.1294 43.0518 45.5658 46.7386 42.6967C50.5621 39.7199 54.8855 37.5674 59.5987 36.3045M59.0353 34.2019C38.5785 39.6832 26.4356 60.7644 31.9386 81.3021C37.4417 101.84 58.4807 114.03 78.9551 108.544C99.4296 103.058 111.555 81.9812 106.052 61.4435C100.549 40.9059 79.5097 28.7157 59.0353 34.2019Z" fill="#004CFF"/>
					<path d="M77.8194 104.305C95.9613 99.4441 106.715 80.7512 101.839 62.5533C96.9631 44.3555 78.3034 33.5439 60.1615 38.405C42.0197 43.2661 31.2657 61.9591 36.1418 80.1569C41.0179 98.3547 59.6776 109.166 77.8194 104.305Z" fill="black"/>
					<path d="M85.4135 45.2413C84.556 45.3951 77.3613 46.6113 70.5839 44.6364C65.4734 43.1543 61.7939 39.8986 60.5603 38.2958L59.7571 38.511C59.4902 40.5159 57.9485 45.1682 54.2467 49.014C49.3471 54.1177 42.5265 56.6593 41.7064 56.9526C41.6534 56.9668 41.6453 57.0069 41.6595 57.06C41.6737 57.1132 41.7185 57.1391 41.7538 57.1296C42.7374 56.961 50.8729 55.6991 57.0787 58.259C62.1276 60.3411 64.6828 65.3404 65.5299 68.2282C65.5536 68.3167 65.6838 68.3174 65.696 68.2216L66.2156 64.5738C66.2109 64.5561 66.1925 64.2052 66.1878 64.1875L67.5764 63.8534L70.5035 67.3107C69.735 64.5133 69.2502 58.5821 72.734 54.0641C76.8284 48.7444 84.5049 45.7694 85.4411 45.4237C85.4764 45.4142 85.5022 45.3694 85.4879 45.3162C85.5138 45.2714 85.469 45.2454 85.4113 45.2419L85.4135 45.2413Z" fill="#0050FF"/>
					<path d="M79.7758 46.7519C72.6402 48.4005 64.5705 45.9274 60.7246 38.9089L59.9567 39.1146C60.136 47.118 54.3657 53.2972 47.3618 55.4372C47.3132 55.4502 47.2842 55.5007 47.2972 55.5494C47.3103 55.5981 47.3607 55.6273 47.4092 55.6143C48.9381 55.3185 55.4695 54.2041 59.176 56.5891C63.113 59.1376 65.0889 64.4819 65.5276 67.3107L64.806 61.6873L64.3826 54.5203L67.8091 60.8826L69.9959 66.1134C68.9614 63.4443 68.0005 57.828 70.1358 53.6524C72.1403 49.7562 78.3132 47.4451 79.821 46.9295C79.874 46.9154 79.8951 46.8528 79.8856 46.8174C79.8759 46.7725 79.8321 46.7415 79.7868 46.7489C79.7824 46.7501 79.778 46.7513 79.7758 46.7519Z" fill="#FF0000"/>
					<path d="M97.5558 49.0832C94.676 45.3879 91.1546 42.2986 87.0806 39.9362C83.0362 37.5872 78.577 36.0469 73.9496 35.4056C69.1499 34.7393 64.3295 35.0369 59.6163 36.2998C54.9031 37.5627 50.562 39.7199 46.7562 42.692C43.0752 45.5738 39.9995 49.0999 37.6497 53.1812C35.3133 57.2328 33.7839 61.7015 33.1514 66.3403C32.4943 71.1518 32.7986 75.9856 34.0654 80.7133C35.3321 85.441 37.4903 89.797 40.4603 93.6176C43.3401 97.3129 46.8616 100.402 50.9356 102.765C54.98 105.114 59.4392 106.654 64.0666 107.295C68.8662 107.962 73.6867 107.664 78.3998 106.401C83.113 105.138 87.4541 102.981 91.2599 100.009C94.941 97.127 98.0166 93.6009 100.366 89.5196C102.703 85.468 104.232 80.9993 104.865 76.3605C105.522 71.549 105.218 66.7152 103.951 61.9875C102.684 57.2598 100.531 52.9215 97.5558 49.0832ZM88.997 43.8138C88.148 55.0936 81.5031 64.9991 71.4536 68.9681C70.5653 67.3297 69.7679 65.5364 69.0457 63.6091C68.9812 63.439 68.9167 63.2689 68.8345 63.1035C67.6216 59.7681 67.3688 57.492 67.3509 56.3131C67.3523 56.1063 67.3407 55.922 67.3623 55.7288L67.3731 55.5575C67.5998 52.4935 69.6751 49.762 72.7534 48.8233C72.802 48.8103 72.831 48.7598 72.818 48.7111C72.8049 48.6624 72.7545 48.6332 72.706 48.6462C69.4783 49.0983 66.3054 47.8657 64.2087 45.557C62.6149 43.8633 61.4725 41.0736 60.9099 39.4594L60.5745 38.3489C70.7571 35.7154 81.0682 38.0363 88.9964 43.8115L88.997 43.8138ZM67.1912 64.6493C69.4304 70.5611 72.4704 75.2075 76.3766 78.6824C74.7892 79.1836 73.1281 79.6833 71.3474 80.1604C69.562 80.6198 67.8778 81.0332 66.253 81.395C67.9161 76.4278 68.2256 70.8839 67.1912 64.6493ZM59.7795 38.524C59.8555 38.8784 59.9587 39.2635 60.0443 39.6534C60.3641 41.3326 60.7718 44.3192 60.2363 46.5835C59.5795 49.6489 57.4432 52.2852 54.422 53.5075C54.369 53.5217 54.3479 53.5843 54.3574 53.6197C54.3671 53.6645 54.4109 53.6955 54.4562 53.6881C54.4606 53.6869 54.465 53.6857 54.4672 53.6851C57.6025 52.9589 60.7478 54.2915 62.4761 56.8317C62.508 56.8801 62.5352 56.9107 62.5712 56.9746L62.8732 57.4749C63.4535 58.5198 64.3663 60.6024 64.9835 64.0974C65.0127 64.277 65.0466 64.4743 65.0534 64.6409C65.3917 66.6711 65.593 68.6051 65.6476 70.4859C54.9424 72.0781 44.2549 66.8168 37.8775 57.4732C41.8631 48.5436 49.6516 41.3706 59.7779 38.5268L59.7795 38.524ZM36.1572 80.1528C34.2854 73.1674 34.7142 66.109 36.9882 59.7944C43.8261 68.9765 54.7272 74.126 65.6794 72.6171C65.5628 75.9505 64.9685 79.0372 63.8613 81.8864C54.5604 83.7594 48.023 83.9335 43.9146 83.6846C40.3205 83.4662 38.0342 82.8951 36.8836 82.5107C36.6018 81.7416 36.373 80.9584 36.1572 80.1528ZM77.8194 104.305C71.5281 105.998 64.8801 105.839 58.6699 103.845C61.6706 97.6558 66.7648 92.3695 74.0949 90.4054C81.425 88.4413 88.48 90.4723 94.1731 94.3318C89.945 99.0113 84.3662 102.551 77.8194 104.305ZM100.497 84.2871C93.65 84.3567 89.5809 83.3452 86.4588 82.2318C85.1759 81.7689 83.8753 81.178 82.6989 80.5562L80.1029 81.4771C81.8316 82.5535 83.7462 83.4852 85.7529 84.2048C90.1206 85.7745 94.8389 86.3487 99.5496 86.4007C98.4502 88.6524 97.103 90.7736 95.5389 92.7299C88.6164 87.9804 80.8153 86.4483 73.5558 88.3935C66.2963 90.3386 60.3065 95.566 56.6862 103.14C54.3463 102.228 52.125 101.06 50.0482 99.6646C54.1043 97.2825 57.9008 94.4077 60.8985 90.8646C62.2766 89.238 63.4688 87.4738 64.4277 85.6773C63.5337 85.8623 62.6371 86.029 61.7368 86.173C61.0288 87.2997 60.1979 88.4618 59.3184 89.504C57.1696 92.0321 54.1536 94.9421 48.1887 98.303C43.7711 94.8703 40.1612 90.3386 37.8238 84.9607C42.4193 86.0566 52.9202 87.1262 71.8969 82.1933C90.8159 76.9745 99.3745 70.7955 102.789 67.5534C103.464 73.3577 102.611 79.1043 100.499 84.2865L100.497 84.2871ZM96.8869 69.4907C93.454 71.7627 87.7224 74.8736 78.7311 77.902C76.3429 75.9704 74.2896 73.6122 72.5219 70.7837C82.7565 66.5966 89.6272 56.7042 90.9579 45.3332C96.0846 49.6648 99.9851 55.5633 101.857 62.5486C102.073 63.3543 102.248 64.1517 102.407 64.9538C101.568 65.8737 99.8903 67.5045 96.8869 69.4907Z" fill="white"/>
					<path d="M32.7079 104.42L29.5546 100.331C28.0293 98.3363 26.2029 97.9456 24.5886 99.1847C23.0836 100.338 22.9652 102.341 24.3677 104.159L29.2717 110.519L36.8188 104.687L35.1542 102.526L32.7057 104.421L32.7079 104.42ZM29.3062 107.021L26.2385 103.039C25.7011 102.357 25.6983 101.72 26.1954 101.342C26.7232 100.938 27.4097 101.055 27.9199 101.706L30.9924 105.705L29.3062 107.021Z" fill="black"/>
					<path d="M28.8802 93.4183L26.6516 93.133L24.4592 87.6783L25.8753 85.9111L24.822 83.3039L17.9477 91.7882L19.1116 94.667L29.9341 96.0277L28.8808 93.4205L28.8802 93.4183ZM20.6328 92.3829L22.9043 89.6156L24.1925 92.8169L20.635 92.3824L20.6328 92.3829Z" fill="black"/>
					<path d="M24.4774 79.361L21.4043 79.6222L21.0541 75.4555L23.9388 72.9556L23.6641 69.8385L20.4634 72.5536C19.8444 71.2937 18.8051 70.6897 17.3955 70.8041C15.513 70.9716 14.3181 72.5847 14.5207 74.8766L15.2101 82.8951L24.7044 82.0971L24.4774 79.361ZM18.8507 74.7696L19.2797 79.7954L17.138 79.9754L16.709 74.9497C16.6274 74.0891 16.9916 73.5597 17.596 73.5117C18.2575 73.4649 18.7567 73.9337 18.8507 74.7696Z" fill="black"/>
					<path d="M24.6923 65.0794L15.2462 63.7627L14.8703 66.4729L24.3184 67.8057L24.6923 65.0794Z" fill="black"/>
					<path d="M25.8176 50.7792C24.2029 50.1989 22.9238 51.4977 21.4631 54.7049C20.4115 56.9936 20.0609 58.2713 19.3146 58.0016C18.8159 57.8173 18.7804 56.7759 19.4118 55.0102C19.9183 53.6172 20.7191 52.3517 21.8552 51.1459L20.6832 49.3581C19.1693 50.4778 18.1195 52.1468 17.2883 54.4904C16.1181 57.7313 16.6571 60.0255 18.4569 60.6701C20.0268 61.2244 21.4729 60.1253 22.7117 57.3523C23.8542 54.7759 24.449 53.3592 25.048 53.5735C25.5644 53.7531 25.5774 54.7815 24.9461 56.5472C24.2532 58.4978 23.2779 59.9595 21.8475 61.0379L22.9767 62.9486C24.9376 61.4672 26.1935 59.667 27.0377 57.301C28.288 53.7943 27.7196 51.4699 25.8153 50.7798L25.8176 50.7792Z" fill="black"/>
					<path d="M38.7639 34.8677C38.1348 34.2677 37.3433 34.1026 36.2992 34.3278C36.3255 33.5877 36.1049 33.0466 35.6015 32.5624C35.1571 32.1572 34.5464 31.908 33.8925 31.9124C32.9068 31.9322 31.8703 32.3974 31.0829 33.2275L25.4367 39.2429L32.373 45.7916L38.2133 39.5913C39.8316 37.8815 39.9607 35.9894 38.7611 34.8661L38.7639 34.8677ZM30.0179 39.7827L28.8902 38.7161L32.5737 34.8018C32.9705 34.3941 33.4996 34.3473 33.8253 34.6538C34.151 34.9603 34.1294 35.4358 33.7455 35.821L30.0185 39.7849L30.0179 39.7827ZM36.7045 38.0646L32.6853 42.3322L31.4585 41.1783L35.4648 36.9331C35.8906 36.5011 36.4212 36.4515 36.747 36.758C37.0998 37.0952 37.0992 37.6576 36.7045 38.0646Z" fill="black"/>
					<path d="M41.3345 25.3968L41.3468 36.3344L43.8051 34.9616L43.8182 32.7068L48.951 29.8678L50.8608 31.0641L53.2973 29.6806L44.037 23.8851L41.3367 25.3962L41.3345 25.3968ZM43.8257 30.2282L43.7987 26.632L46.8402 28.557L43.8279 30.2276L43.8257 30.2282Z" fill="black"/>
					<path d="M59.7214 22.3845C57.2406 22.6934 55.9721 23.0522 55.801 22.2725C55.6958 21.7385 56.5708 21.1648 58.3976 20.7892C59.871 20.4893 61.3533 20.5049 62.9353 20.8306L63.8391 18.8994C62.0941 18.1856 60.1263 18.1673 57.697 18.6687C54.3337 19.3825 52.6612 21.031 53.0503 22.8981C53.3938 24.5331 55.0893 25.2032 58.0897 24.812C60.8757 24.4593 62.4028 24.2186 62.5318 24.8411C62.637 25.3751 61.7749 25.9264 59.9481 26.302C57.9299 26.7313 56.1919 26.6704 54.5157 25.9927L53.4882 27.957C55.7881 28.8614 57.9787 29.0051 60.4234 28.4995C64.0587 27.7508 65.7549 26.058 65.3354 24.0686C64.9931 22.3763 63.2149 21.9537 59.7208 22.3823L59.7214 22.3845Z" fill="black"/>
					<path d="M81.1233 18.6212L77.252 18.2684L70.8997 21.79L71.2665 17.7134L68.5426 17.4683L67.6899 26.9866L70.4116 27.2323L70.664 24.4057L72.9953 23.1239L77.0116 27.8479L80.5941 28.1643L75.1924 21.8971L81.1233 18.6212Z" fill="black"/>
					<path d="M90.7591 28.5364L91.591 26.5485L86.8095 24.5465L87.3973 23.1127L94.4374 26.0681L95.2716 24.0796L85.717 20.0544L82.0352 28.8646L91.9424 33.0231L92.7765 31.0347L85.3957 27.9286L85.9748 26.5327L90.7591 28.5364Z" fill="black"/>
					<path d="M106.215 34.6217L107.534 32.9161L98.1888 25.6821L96.867 27.3861L100.46 30.1785L95.9455 36.0213L98.0976 37.6983L102.612 31.8533L106.215 34.6217Z" fill="black"/>
					<path d="M107.349 47.9986C108.738 49.8969 110.566 50.3632 111.894 49.3882C112.595 48.8634 112.903 48.1238 112.845 47.0694C113.58 47.2281 114.148 47.114 114.711 46.6998C115.195 46.3447 115.55 45.7799 115.658 45.1319C115.825 44.15 115.547 43.0408 114.868 42.1148L109.977 35.4498L102.308 41.1082L107.353 47.9952L107.349 47.9986ZM109.86 38.9377L113.043 43.2823C113.376 43.7554 113.333 44.2934 112.974 44.5582C112.627 44.8005 112.169 44.6979 111.846 44.2601L108.608 39.8543L109.86 38.9377ZM110.453 45.758C110.808 46.2441 110.765 46.7822 110.405 47.047C109.998 47.3436 109.462 47.2239 109.139 46.7861L105.663 42.0501L107.004 41.0526L110.455 45.7574L110.453 45.758Z" fill="black"/>
					<path d="M110.756 54.084L112.977 54.4828L114.894 60.0303L113.397 61.7076L114.303 64.3922L121.592 56.2641L120.58 53.3256L109.836 51.4196L110.755 54.0817L110.756 54.084ZM118.959 55.5085L116.546 58.162L115.427 54.8963L118.959 55.5085Z" fill="black"/>
					<path d="M114.818 75.7385L116.978 75.6292L116.566 68.2909L123.941 67.8899L123.788 65.1554L114.269 65.6587L114.818 75.7385Z" fill="black"/>
					<path d="M112.548 87.2307L114.668 87.6778L116.147 80.4874L123.381 82.0031L123.935 79.3212L114.603 77.3735L112.548 87.2307Z" fill="black"/>
				</g>
				<defs>
					<clipPath id="clip0_27_1157">
						<rect width="109.65" height="98.9896" fill="white" transform="translate(0.844849 29.2834) rotate(-15)"/>
					</clipPath>
				</defs>
			</svg>

			<AtomsCornerPoints :size-points="8" />
	    </EKinesis>

		<div
			ref="bigVisual"
			v-if="contents.pictureFramed?.src"
			class="app-paris-basketball-introduction__f-row__visual"
		>
			<EKinesis :speed="5">
				<nuxt-picture
					provider="directus"
					:src="contents.pictureFramed.src"
					format="webp"
					:alt="contents.pictureFramed.alt"
					sizes="sm:35vw md:50vw"
					/>
				<!-- AppPbbImage
	                :src="contents.pictureFramed.src"
	                :alt="contents.pictureFramed.alt"
	                :lazy="true"
	                :sizes="{
	                  desktop: 'w600,h600,fcrop,q85',
	                  mobile: 'w600,h600,fcrop,q85',
	                }"
	             / -->
				<ELottie id="Cadre_02" />
			</EKinesis>
    	</div>



		<div
			ref="pointsVisual"
			v-if="contents.picture?.src"
			class="app-paris-basketball-introduction__s-row__visual"
		>
			<EKinesis :speed="8.5">
				<AtomsCornerPoints :size-points="8" />
				<nuxt-picture
					provider="directus"
					:src="contents.picture.src"
					format="webp"
					:alt="contents.picture.alt"
					sizes="sm:35vw md:50vw"
					/>
				<!-- AppPbbImage
	                :src="contents.picture.src"
	                :alt="contents.picture.alt"
	                :lazy="true"
	                :sizes="{
	                  desktop: 'w600,h600,fcrop,q85',
	                  mobile: 'w600,h600,fcrop,q85',
	                }"
	             / -->

			</EKinesis>
   		</div>

    	<div class="app-paris-basketball-introduction__s-row__content">

			<ERichText
				ref="title2"
				tag="h4"
				weight="regular"
				:content="contents.title2"
				class="app-paris-basketball-introduction__s-row__content__title"
			/>

			<ERichText
				ref="paragraph2"
				tag="p"
				weight="medium"
				:content="contents.paragraph2"
				class="app-paris-basketball-introduction__s-row__content__text"
			/>

			<div class="app-paris-basketball-introduction__social-networks">

				<a
					v-if="contents.social_networks.facebook_link"
					:href="contents.social_networks.facebook_link"
					target="_blank"
					class="app-paris-basketball-introduction__social-network"
				>
					<SvgFooterFacebook />
				</a>
				<a
					v-if="contents.social_networks.linkedin_link"
					:href="contents.social_networks.linkedin_link"
					target="_blank"
					class="app-paris-basketball-introduction__social-network"
				>
					<SvgFooterLinkedin />
				</a>
				<a
					v-if="contents.social_networks.instagram_link"
					:href="contents.social_networks.instagram_link"
					target="_blank"
					class="app-paris-basketball-introduction__social-network"
				>
					<SvgFooterInstagram />
				</a>
				<a
					v-if="contents.social_networks.twitter_link"
					:href="contents.social_networks.twitter_link"
					target="_blank"
					class="app-paris-basketball-introduction__social-network"
				>
					<SvgFooterTwitter />
				</a>
			</div>
		</div>
	</div>
</template>

<script>
import { gsap } from 'gsap'
import { mapState, mapMutations } from 'vuex'

export default {
	props: {
		contents: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		...mapState({
			allLoadedFake: (state) => state.allLoadedFake,
			initialHeroDisplayed: (state) => state.initialHeroDisplayed,
		}),
	},
	watch: {
		initialHeroDisplayed(newVal) {
			if (!newVal) return

			if (this.$viewport.isMobile) {
				this.setAllowScroll(true)
			} else {
				this.appearHero(0.2)
			}
		},
	},
	mounted() {
		if (this.allLoadedFake && !this.$viewport.isMobile) {
			this.appearHero(0.85)
		} else if (this.allLoadedFake && this.$viewport.isMobile) {
			this.setAllowScroll(true)
		}
	},
	beforeDestroy() {
		this.tlAppear?.kill()
		this.mm?.revert()
	},
	methods: {
		appearHero(delay = 0) {
			this.tlAppear?.clear()
			this.tlAppear?.kill()

			this.tlAppear = gsap
				.timeline({
					delay,
					onComplete: () => {
						this.initMatchMedia()
					},
				})
				.addLabel('texts')
				.fromTo(
					this.$refs.maintitle,
					{
						y: '-120%',
					},
					{
						y: '0',
						duration: 0.6,
						stagger: 0.075,
						ease: 'power3.out',
					},
					'texts'
				)
				.fromTo(
					[this.$refs.paragraph1, this.$refs.paragraph2.$el],
					{
						y: -30,
					},
					{
						y: 0,
						duration: 0.6,
						ease: 'power3.out',
					},
					'texts+=15%'
				)
				.fromTo(
					[this.$refs.paragraph1, this.$refs.paragraph2.$el],
					{
						opacity: 0,
					},
					{
						opacity: 1,
						duration: 0.85,
						ease: 'power3.out',
					},
					'texts+=15%'
				)
				.addLabel('visuals', 'texts')
				.fromTo(
					this.$refs.bigVisual,
					{
						y: '50%',
						rotate: -10,
					},
					{
						y: '0%',
						rotate: -5,
						duration: 0.5,
						ease: 'power3.out',
					},
					'visuals'
				)
				.fromTo(
					this.$refs.bigVisual,
					{
						opacity: 0,
					},
					{
						opacity: 1,
						duration: 0.55,
						ease: 'power3.out',
					},
					'visuals+=5%'
				)
		},
		initMatchMedia() {
			this.mm = gsap.matchMedia()

			this.mm.add('(min-width: 768px)', (context) => {
    			this.setAllowScroll(true)

				const tweenBigVisual = gsap.to(this.$refs.bigVisual, {
					yPercent: -20,
					rotate: 0,
					scrollTrigger: {
						trigger: this.$el,
						scrub: 0.5,
						start: `top top+=${window.innerWidth * 0.138888}`, // padding-top value
					},
				})

				const tweenPointsVisual = gsap.to(this.$refs.pointsVisual, {
					rotate: 2,
					yPercent: -30,
					scrollTrigger: {
						trigger: this.$el,
						scrub: 0.5,
						start: `top top+=${window.innerWidth * 0.138888}`, // padding-top value
					},
				})

				return () => {
					tweenBigVisual?.kill()
					tweenPointsVisual?.kill()
				}
			})
		},
		...mapMutations({
			setAllowScroll: 'setAllowScroll',
		}),
	},
}
</script>

<style lang="scss">
	.app-paris-basketball-introduction {
		position: relative;
		margin-bottom: desktop-vw(130px);
		row-gap: desktop-vw(85px);

		@include mobile {
			overflow-x: hidden;
		}

    &__arrow {
      position: absolute;
      width: 8vw;
      height: auto;
      bottom: 9vh;
      left: 9vw;

      @include mobile {
        left: auto;
        right: 5vw;
        bottom: 25%;
        width: 20vw;
        height: auto;
        transform: scaleX(-1);
			}
    }


		&__visual-transparent.app-element-kinesis {
			position: absolute;
			z-index: 10;
			top: desktop-vw(160px);
			left: desktop-vw(-50px);

			display: flex;
			align-items: center;
			justify-content: center;
			height: auto;

			grid-column: 6 / span 2;
			width: columns(1.5);

			transform: rotate(8deg);
			aspect-ratio: 128 / 128;

			@include mobile {
				position: relative;
				top: unset;
				left: mobile-vw(20px);
				grid-column: 1 / span 2;
				margin-top: mobile-vw(80px);
				width: 100%;
				aspect-ratio: 150/150;
				grid-row: 2;
			}

			@include fake-transparent();

			svg {
				display: block;
				width: 94%;
				height: auto;
			}
		}

		&__f-row {
			&__content {
				grid-column: 2 / span 4;
				grid-row: 1;

				@include mobile {
					grid-column: 1 / span 6;
				}

				&__title {
					margin-bottom: desktop-vw(160px);

					@include mobile {
						margin-bottom: mobile-vw(78px);
					}

					.H2{
						@include font-ITCFranklinGothicLT-BkCp();
						font-size: desktop-vw(100px);
						line-height:desktop-vw(100px);
						font-weight: 400;
						letter-spacing: desktop-vw(-2px);

						@include mobile {
							font-size: mobile-vw(96px);
							line-height:mobile-vw(96px);
							letter-spacing: mobile-vw(-2px);
						}

						strong{
							font-weight: 600;
							letter-spacing: desktop-vw(-3px);

							@include mobile {
								letter-spacing: mobile-vw(-3px);
							}
						}

						.app-element-lottie-word.Cercle_2 svg{
							width: 70% !important;
							height: auto !important;
							transform: scale(1, 1.75) !important;
						}
					}
				}

				&__subtitle {
					margin-bottom: desktop-vw(32px);

					@include mobile {
						margin-bottom: mobile-vw(32px);
					}

					.H4{
						font-size: desktop-vw(32px);
						line-height: desktop-vw(32px);
						text-transform: uppercase;
						letter-spacing: desktop-vw(-0.32px);

						@include mobile {
							font-size: mobile-vw(32px);
							line-height: mobile-vw(32px);
							letter-spacing: mobile-vw(-0.32px);
						}

					}
				}

				&__text{
					width: 80%;

					@include mobile {
						width: 100%;
					}

					.P2{
						font-size: desktop-vw(17px);
						line-height: desktop-vw(20px);

						@include mobile {
							font-size: mobile-vw(17px);
							line-height: mobile-vw(20px);
						}

						strong{
							font-size: desktop-vw(18px);
							text-transform: uppercase;

							@include mobile {
								font-size: mobile-vw(18px);
							}
						}
					}
				}
			}

			&__visual {
				position: relative;
				grid-column: 6 / span 6;
				aspect-ratio: 650 / 785;
				margin-top: desktop-vw(220px);
				transform: rotate(-5deg);
				grid-row: 1;
				left: 10%;
				width: 90%;

				@include mobile {
					grid-column: 2 / span 5;
					left: 0;
					top: 0;
					grid-row: 2;
					margin-top: mobile-vw(120px);
					aspect-ratio: 333/413;
					margin-bottom: mobile-vw(270px);
				}

				picture {
					z-index: 0;
					@include noise();

					position: absolute;
					width: 100%;
					height: 100%;
					display: block;

					img {
						width: 100%;
						height: 100%;
						object-fit: cover;
					}
				}

				svg,
				canvas {
					position: absolute;
					top: 50%;
					left: 0;
					height: 115% !important;
					width: auto !important;
					left: 50%;
					transform: translate(-50%, -50%) rotate(4deg) !important;
				}
			}
		}

		&__s-row {
			&__content {
				grid-column: 8 / span 4;
				grid-row: 2;

				@include mobile {
					grid-column: 1 / span 6;
					grid-row: 3;
				}

				&__title {
					margin-bottom: desktop-vw(53px);

					@include mobile {
						margin-bottom: mobile-vw(53px);
					}

					.H4{
						font-size: desktop-vw(32px);
						line-height: desktop-vw(32px);
						text-transform: uppercase;
						letter-spacing: desktop-vw(-0.32px);

						@include mobile {
							font-size: mobile-vw(32px);
							line-height: mobile-vw(32px);
							letter-spacing: mobile-vw(-0.32px);
						}

					}
				}

				&__text {
					margin-left: columns(1.15);
					width: 65%;

					@include mobile {

						margin-left: 0;
						width: 100%;
					}

					.P2{

						font-size: desktop-vw(17px);
						line-height: desktop-vw(20px);

						@include mobile {
							font-size: mobile-vw(17px);
							line-height: mobile-vw(20px);
						}
					}

					ul{

						li{
							@include font-ITCFranklinGothicLT-BkCp();
							font-size: desktop-vw(17px);
							line-height: desktop-vw(20px);
							font-weight: 400;
							list-style-position: inside;

							@include mobile {
								font-size: mobile-vw(17px);
								line-height: mobile-vw(20px);
							}

							&::marker{
								font-size: desktop-vw(8px);

								@include mobile {
									font-size: mobile-vw(8px);
								}
							}
						}
					}
				}
			}

			&__visual {
				grid-column: 3 / span 5;
				aspect-ratio: 460/550;
				transform: rotate(5.5deg);
				left: 0;
				position: absolute;
				top: desktop-vw(-140px);
				grid-row: 2;
				width: 90%;

				@include mobile {
					grid-column: 1 / span 4;
					top: 0;
					left: mobile-vw(20px);
					aspect-ratio: 230/275;
					top: mobile-vw(387px);
				}

				picture {
					z-index: 0;
					@include noise();

					position: absolute;
					width: 100%;
					height: 100%;
					display: block;

					img {
						width: 100%;
						height: 100%;
						object-fit: cover;
					}
				}
			}
		}

		&__social-networks {
			display: flex;
			margin-left: columns(1.15);
			margin-top: desktop-vw(36px);

			@include mobile {
				margin-left: 0;
				margin-top: mobile-vw(24px);
			}
		}

		&__social-network {
			width: desktop-vw(56px);
			height: desktop-vw(56px);
			display: flex;
			justify-content: center;
			align-items: center;
			border-top: 1px solid var(--c-black);
			border-left: 1px solid var(--c-black);
			border-bottom: 1px solid var(--c-black);
			cursor: pointer;
			position: relative;

			@include mobile {
				width: mobile-vw(56px);
				height: mobile-vw(56px);
			}

			svg {
				z-index: 1;

				path {
					fill: var(--c-black);
					// transition: fill 0.25s 0.1s var(--ease-out-expo);
				}
			}

			@include hover {
				&:hover {
					&::after {
						transform: scaleY(1);
					}
					svg {
						path {
							fill: var(--c-white);
						}
					}
				}
			}

			&::after {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: var(--c-black);
				transform-origin: top center;
				transform: scaleY(0);
				transition: transform 0.65s var(--ease-out-expo);
			}

			&:last-child {
				border-left: 1px solid var(--c-black);
				border-right: 1px solid var(--c-black);
			}
		}

	}
</style>
