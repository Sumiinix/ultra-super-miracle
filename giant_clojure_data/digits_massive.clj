(ns giant-data.digits-massive
  (:require [clojure.data.json :as json]))

;; Giant dataset of digits and numerical data structures
(def digits-encyclopedia
  {:metadata {:theme "digits-and-numerical-systems"
              :created-at (java.time.Instant/now)
              :version "1.0"}
   
   :binary-data (vec (range 0 65536))
   
   :hexadecimal-map
   (into {}
     (for [i (range 256)]
       [(format "%02x" i)
        {:decimal i
         :binary (Integer/toBinaryString i)
         :octal (Integer/toOctalString i)}]))
   
   :fibonacci-sequence
   (take 1000
     (iterate (fn [[a b]] [b (+ a b)]) [0 1]))
   
   :prime-numbers
   (filter (fn [n]
     (if (< n 2) false
       (not-any? #(zero? (mod n %))
         (range 2 (inc (Math/sqrt n))))))
     (range 2 10000))
   
   :digit-mapping
   (into {}
     (for [i (range 0 10)]
       [i {:word (case i
             0 "zero" 1 "one" 2 "two" 3 "three" 4 "four"
             5 "five" 6 "six" 7 "seven" 8 "eight" 9 "nine")
           :factors (filter #(zero? (mod i %))
                      (range 1 (inc i)))
           :binary (Integer/toBinaryString i)
           :hex (Integer/toHexString i)}]))
   
   :mathematical-constants
   {:pi 3.141592653589793
    :e 2.718281828459045
    :golden-ratio 1.618033988749895
    :tau 6.283185307179586
    :euler-mascheroni 0.5772156649015329
    :sqrt-2 1.4142135623730951
    :sqrt-3 1.7320508075688772
    :sqrt-5 2.23606797749979}
   
   :large-number-sequences
   {:powers-of-2 (map #(bit-shift-left 1 %) (range 1000))
    :powers-of-10 (map #(Math/pow 10 %) (range 100))
    :triangular-numbers (map #(* % (inc %)) (range 5000))
    :square-numbers (map #(* % %) (range 5000))
    :cubic-numbers (map #(* % % %) (range 2000))}
   
   :digit-statistics
   {:frequency-in-pi (into {} (for [d "0123456789"]
                                [d (rand-int 1000)]))
    :distribution-analysis (vec (repeatedly 1000
                                  #(rand-int 10)))
    :frequency-matrix (vec (for [i (range 100)]
                              (vec (for [j (range 100)]
                                     (rand-int 256)))))}
   
   :numeric-sequences
   {:collatz-sequence (fn [n]
       (take-while (fn [x] (not= x 1))
         (iterate (fn [x]
           (if (even? x) (/ x 2) (+ 1 (* 3 x))))
           n)))
    :factorials (map (fn [n]
                   (reduce * 1 (range 1 (inc n))))
                 (range 1 100))}
   
   :giant-vectors
   {:vector-1 (vec (range 100000))
    :vector-2 (vec (map #(* % 2) (range 50000)))
    :vector-3 (vec (map #(* % % %) (range 20000)))
    :vector-4 (vec (repeatedly 10000 #(rand-int 1000000)))}
   
   :nested-structure
   (vec (for [i (range 100)]
          {:id i
           :values (vec (range 1000))
           :metadata {:timestamp (java.time.Instant/now)
                     :index i
                     :nested-nested
                     (vec (for [j (range 50)]
                            {:sub-id j
                             :data (vec (range 100))}))}
           :encoded (java.util.Base64/getEncoder)
           :hexagon-data (vec (for [k (range 1000)]
                                (Integer/toHexString k)))}))
   
   :charset-data
   (into {}
     (for [i (range 32 127)]
       [(char i) {:code i
                  :binary (Integer/toBinaryString i)
                  :octal (Integer/toOctalString i)
                  :hex (Integer/toHexString i)}]))
   
   :matrix-data
   (vec (for [row (range 1000)]
          (vec (for [col (range 100)]
                 (* row col)))))})

;; Functions to work with digit data
(defn count-digits [n]
  (count (str (Math/abs n))))

(defn digit-sum [n]
  (reduce + (map #(Character/digit % 10) (str (Math/abs n)))))

(defn is-palindrome? [n]
  (let [s (str n)]
    (= s (clojure.string/reverse s))))

(defn generate-digit-report []
  {:report-type "digit-analysis"
   :total-entries (count digits-encyclopedia)
   :analysis-timestamp (java.time.Instant/now)
   :sections (keys digits-encyclopedia)})

;; Export the massive dataset
(def export-data
  (json/write-str digits-encyclopedia))

